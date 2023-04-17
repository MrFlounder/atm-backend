export class AccountNotFoundError extends Error {
  statusCode: number
  constructor(message: string) {
    super(message)
    this.name = 'AccountNotFoundError'
    this.statusCode = 404
  }
}

export class InsufficientBalanceError extends Error {
  statusCode: number
  constructor(message: string) {
    super(message)
    this.name = 'InsufficientBalanceError'
    this.statusCode = 400
  }
}
