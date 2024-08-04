import { NextFunction, Request, Response } from 'express'
import { getNativeBalance, getTokenBalance } from './helper/fundReceive.js'
import { getNetDeposit, getNetWithdrawl, getiFILBalance } from './helper/glifYield.js'

export const fundReceive_balance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenAddress = req.query.tokenAddress
    let value
    if (tokenAddress === '0x0000000000000000000000000000000000000000') {
      value = await getNativeBalance()
    } else {
      value = await getTokenBalance(tokenAddress as string)
    }
    res.status(200).json({ value })
  } catch (error) {
    next(error)
  }
}

export const net_deposit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const value = await getNetDeposit()
    res.status(200).json({ value })
  } catch (error) {
    next(error)
  }
}

export const net_withdrawl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const value = await getNetWithdrawl()
    res.status(200).json({ value })
  } catch (error) {
    next(error)
  }
}

export const iFil_balance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const value = await getiFILBalance()
    res.status(200).json({ value })
  } catch (error) {
    next(error)
  }
}
