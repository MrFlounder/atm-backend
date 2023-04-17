import db from '../db/db'
import { Account } from '../entities/Account'
import { Transfer } from '../entities/Transfer'
import {
  AccountNotFoundError,
  InsufficientBalanceError
} from '../errors/errors'
import {
  AccountBalanceAdjustmentType,
  TransferRequest,
  TransferType
} from '../types/types'
import { adjustAccountBalance } from './accountController'

const transferRepository = db.getRepository(Transfer)
const accountRepository = db.getRepository(Account)
const PENALTY = 15
const MIN_BALANCE = -100

export async function deposit({
  accountId,
  amount
}: TransferRequest): Promise<number> {
  const deposit = transferRepository.create({
    amount,
    accountId,
    type: TransferType.DEPOSIT
  })
  await deposit.save()
  const newBalance = await adjustAccountBalance({
    accountId,
    amount,
    type: AccountBalanceAdjustmentType.INCREASE
  })
  return newBalance
}

export async function withdraw({
  accountId,
  amount
}: TransferRequest): Promise<number> {
  const account = await accountRepository.findOne({
    where: {
      id: accountId
    }
  })
  if (!account) {
    throw new AccountNotFoundError('Account not found')
  }
  let penalty = 0
  if (account.balance - amount - PENALTY < MIN_BALANCE) {
    throw new InsufficientBalanceError('Insufficient balance')
  }
  if (account.balance - amount < 0) {
    penalty = PENALTY
  }
  const withdraw = transferRepository.create({
    amount,
    accountId,
    type: TransferType.WITHDRAW
  })
  const penaltyTransfer = transferRepository.create({
    amount: penalty,
    accountId,
    type: TransferType.PENALTY
  })
  await withdraw.save()
  await penaltyTransfer.save()

  const newBalance = await adjustAccountBalance({
    accountId,
    amount: amount + penalty,
    type: AccountBalanceAdjustmentType.DECREASE
  })
  return newBalance
}

export async function getTransactionHistory(
  accountId: string,
  page: number,
  limit: number
): Promise<{ transactions: Transfer[]; totalPages: number }> {
  const [transactions, count] = await transferRepository.findAndCount({
    where: {
      accountId
    },
    take: limit,
    skip: (page - 1) * limit
  })
  const totalPages = Math.ceil(count / limit)
  return { transactions, totalPages }
}
