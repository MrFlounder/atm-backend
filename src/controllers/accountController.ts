import { encrypt, hashWithSalt } from '../auth/authService'
import db from '../db/db'
import { Account } from '../entities/Account'
import {
  AccountBalanceAdjustmentRequest,
  AccountBalanceAdjustmentType,
  AccountCreationRequest
} from '../types/types'

const accountRepository = db.getRepository(Account)

export async function createAccount(
  accountInfo: AccountCreationRequest
): Promise<Account> {
  if (isExistingAccount(accountInfo.email)) {
    throw new Error(
      'This email is already associated with an existing account. Please login instead.'
    )
  }
  const { salt, hashedBuffer } = hashWithSalt(accountInfo.password)
  const newAccount = accountRepository.create({
    firstname: accountInfo.firstName,
    lastname: accountInfo.lastName,
    email: encrypt(accountInfo.email),
    password: hashedBuffer,
    salt,
    balance: 0
  })

  const savedAccount = await newAccount.save()
  return savedAccount
}

// This logic is not implemented yet. It can be used to block account creation if the email is already used in other accounts.
function isExistingAccount(email: string): boolean {
  return false
}

export async function adjustAccountBalance({
  accountId,
  amount,
  type
}: AccountBalanceAdjustmentRequest): Promise<number> {
  let operator: string
  if (type === AccountBalanceAdjustmentType.INCREASE) {
    operator = '+'
  } else {
    operator = '-'
  }
  const result = await accountRepository
    .createQueryBuilder()
    .update(Account)
    .set({ balance: () => `"balance" ${operator} ${amount}` })
    .where({ id: accountId })
    .returning('balance')
    .execute()

  return result.raw[0].balance
}
