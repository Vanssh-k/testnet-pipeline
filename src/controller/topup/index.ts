import {
  create_session_order,
  processStripePayment,
} from './helper/web2Payments/stripe'
import { getActivePlanList, getPlanDetails } from './helper/plansHelper'
import { validateStripPayload } from './helper/stripe'
import {
  createSubDomain,
  subDomainExists,
  getUserSubDomainDomain,
} from './helper/subDomain'
import {
  recordUserTransaction,
  getUserTransactionDetails,
} from './helper/transactionHelper'
import { NextFunction, Request, Response } from 'express'

export const create_subdomain = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await createSubDomain(req.body.publicKey, req.body.subDomain)
    res.status(data.status).json({ data: data.data })
  } catch (error) {
    /* istanbul ignore next */
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
    /* istanbul ignore next */
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
    /* istanbul ignore next */
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
    /* istanbul ignore next */
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
    /* istanbul ignore next */
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
    /* istanbul ignore next */
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
    /* istanbul ignore next */
    next(error)
  }
}

export const create_stripe_order = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await create_session_order(
      req.body.user.publicKey,
      parseInt(req.query.subscriptionId as string),
      req.body.user.email ?? undefined
    )
    res.status(200).json({ ...data })
  } catch (error) {
    console.log(error)
    /* istanbul ignore next */
    next(error)
  }
}

export const webhook_stripe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data: stripeData, eventType } = await validateStripPayload(req)
    await processStripePayment(stripeData, eventType)
    res.status(200).json({})
  } catch (error) {
    console.log(error)
    /* istanbul ignore next */
    next(error)
  }
}
