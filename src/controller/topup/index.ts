import { NextFunction, Request, Response } from 'express'
import { any } from 'joi'
import {
  getActivePlanList,
  usersActivePlan,
  getPlanDetails,
} from './helper/plansHelper'
import {
  createSubDomain,
  subDomainExists,
  getUserSubDomainDomain,
} from './helper/subDomain'
import {
  recordUserTransaction,
  getUserTransactionDetails,
} from './helper/transactionHelper'

export const create_subdomain = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await createSubDomain(req.body.publicKey, req.body.subDomain)
    res.status(data.status).json({ data: data.data })
  } catch (error) {
    next(error)
  }
}

export const check_subdomain = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const exists = await subDomainExists(req.query['subDomain'] as string)
    res.status(200).json(exists)
  } catch (error) {
    next(error)
  }
}

export const get_subdomain = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const records = await getUserSubDomainDomain(req.query.publicKey as string)
    res.status(200).json(records)
  } catch (error) {
    next(error)
  }
}

export const record_transaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req.body
  try {
    const data = await recordUserTransaction(req.body, user)
    res.status(data.status).json({ data: data.data })
  } catch (error) {
    next(error)
  }
}

export const get_user_transactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const record = await getUserTransactionDetails(
      req.query.publicKey as string
    )
    res.status(200).json(record)
  } catch (error) {
    next(error)
  }
}

export const get_active_plan_list = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const planList = await getActivePlanList()
    res.status(200).send(planList)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const plan_details_by_id = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await getPlanDetails(req.query.subscriptionId as string)
    res.status(data.status).json({ data: data.data })
  } catch (error) {
    next(error)
  }
}
