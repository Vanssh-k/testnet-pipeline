import { NextFunction, Request, Response } from 'express'
import { getPoolMetrics } from './helper/poolMetrics.js'
import { getUserMetrics } from './helper/userMetrics.js'
import { getTransactions } from './helper/transactions.js'
import { getHistoricTVL, getHistoricDepositors, getHistoricFees, getHistoricVolume } from './helper/historicData.js'

export const pool_metric = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tvl, volume, fee, stakedAmount, liquidAmount, depositors, composition } = await getPoolMetrics()
    res.status(200).json({ tvl, volume, fee, stakedAmount, liquidAmount, depositors, composition })
  } catch (error) {
    next(error)
  }
}

export const user_metric = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { datacapPurchased, datacapSpent, fileCount, dataUsed } = await getUserMetrics(
      req.query.userAddress as string,
    )
    res.status(200).json({ datacapPurchased, datacapSpent, fileCount, dataUsed })
  } catch (error) {
    next(error)
  }
}

export const all_transactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, lastEvaluatedKey } = await getTransactions(req.query)
    res.status(200).json({ items, lastEvaluatedKey })
  } catch (error) {
    next(error)
  }
}

export const historic_tvl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const value = await getHistoricTVL()
    res.status(200).json(value)
  } catch (error) {
    next(error)
  }
}

export const historic_volume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const value = await getHistoricVolume()
    res.status(200).json(value)
  } catch (error) {
    next(error)
  }
}

export const historic_fees = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const value = await getHistoricFees()
    res.status(200).json(value)
  } catch (error) {
    next(error)
  }
}

export const historic_depositors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const value = await getHistoricDepositors()
    res.status(200).json(value)
  } catch (error) {
    next(error)
  }
}
