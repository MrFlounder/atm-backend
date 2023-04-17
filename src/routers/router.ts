import express, { NextFunction, Request, Response, Router } from 'express'
import Joi from 'joi'
import { createAccount } from '../controllers/accountController'
import {
  deposit,
  getTransactionHistory,
  withdraw
} from '../controllers/transferController'
import {
  AccountNotFoundError,
  InsufficientBalanceError
} from '../errors/errors'
import { ATMSession } from '../types/types'
import { sanitizeAccount } from '../utils/responseSanitizer'

const router: Router = express.Router()

const accountCreationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required()
})

function validateAccountCreationRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error } = accountCreationSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }
  next()
}

const depositWithdrawSchema = Joi.object({
  amount: Joi.number().precision(2).min(0.01).required()
})

function validateDepositWithdrawRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { error } = depositWithdrawSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }
  next()
}

function validateSession(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params
  const session = req.session as ATMSession

  if (session?.account?.id !== id) {
    return res.status(400).json({
      error:
        'You are depositing to an account not in the session, please log out and login again'
    })
  }
  next()
}

function sendCookieInBody(req: Request, res: Response, next: NextFunction) {
  const cookieValue = req.header('Set-Cookie')
  if (cookieValue) {
    res.cookie('Cookie', cookieValue)
  }
  next()
}

// Endpoint for creating an account
router.post(
  '/',
  validateAccountCreationRequest,
  sendCookieInBody,
  async (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = req.body

    try {
      const newAccount = await createAccount({
        email,
        password,
        firstName,
        lastName
      })
      const sanitizedAccountInfo = sanitizeAccount(newAccount)
      const newSession = req.session as ATMSession
      newSession.account = sanitizedAccountInfo
      return res.status(201).json({
        accountInfo: sanitizeAccount(newAccount)
      })
    } catch (error) {
      return res
        .status(400)
        .json({ error: 'Please check your input and try again' })
    }
  }
)

// Endpoint for depositing
router.post(
  '/:id/deposit',
  validateDepositWithdrawRequest,
  validateSession,
  async (req: Request, res: Response) => {
    const { id } = req.params
    const { amount } = req.body
    const newBalance = await deposit({ accountId: id, amount })
    return res.json({ newBalance })
  }
)

// Endpoint for withdrawing from an account
router.post(
  '/:id/withdraw',
  validateDepositWithdrawRequest,
  validateSession,
  async (req: Request, res: Response) => {
    const { id } = req.params
    const { amount } = req.body
    try {
      const newBalance = await withdraw({ accountId: id, amount })
      return res.json({ newBalance })
    } catch (error) {
      if (
        error instanceof AccountNotFoundError ||
        error instanceof InsufficientBalanceError
      ) {
        return res.status(error.statusCode).json({ error: error.message })
      }
      return res.status(500).json({ error: 'Server Error' })
    }
  }
)

// Endpoint for querying all transaction history
router.get(
  '/:id/transactions',
  validateSession,
  async (req: Request, res: Response) => {
    const { id } = req.params
    const { page = 1, limit = 10 } = req.query
    const { transactions, totalPages } = await getTransactionHistory(
      id,
      Number(page),
      Number(limit)
    )
    return res.json({ transactions, totalPages })
  }
)

// Endpoint used to end a session
router.get('/logout', async (req: Request, res: Response) => {
  req.session.destroy((error: Error) => {
    if (error) {
      return res
        .status(500)
        .json({ error: 'Error distroying session when logging out' })
    } else {
      res.clearCookie('myapp.sid')
      return res.status(200).send('Session destroyed')
    }
  })
})

export default router
