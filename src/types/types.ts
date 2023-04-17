import { Session } from 'express-session'

export interface ATMSession extends Session {
  account?: SanitizedAccount
}

export interface SanitizedAccount {
  id: string
  balance: number
  firstName: string
  lastName: string
  createdAt: Date
}

export enum TransferType {
  WITHDRAW = 'WITHDRAW',
  DEPOSIT = 'DEPOSIT',
  PENALTY = 'PENALTY'
}

export enum AccountBalanceAdjustmentType {
  INCREASE = 'INCREASE',
  DECREASE = 'DECREASE'
}

export interface AccountCreationRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface TransferRequest {
  accountId: string
  amount: number
}

export interface AccountBalanceAdjustmentRequest extends TransferRequest {
  type: AccountBalanceAdjustmentType
}
