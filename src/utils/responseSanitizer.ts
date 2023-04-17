import { Account } from '../entities/Account'
import { SanitizedAccount } from '../types/types'

export function sanitizeAccount(account: Account): SanitizedAccount {
  return {
    id: account.id,
    balance: account.balance,
    firstName: account.firstname,
    lastName: account.lastname,
    createdAt: account.createdAt
  }
}
