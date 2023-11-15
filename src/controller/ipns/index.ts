import {
  generateKey,
  getUserIPNSRecords,
  publishRecord,
  removeKey,
} from './helper/ipnsHelper'
import { NextFunction, Request, Response } from 'express'

export const generate_key = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ipnsKeyName = await generateKey(req.body.user.publicKey)
    res.status(200).json(ipnsKeyName)
  } catch (error) {
    /* istanbul ignore next */
    next(error)
  }
}

export const get_ipns_records = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ipnsRecords = await getUserIPNSRecords(req.body.user.publicKey)
    res.status(200).json(ipnsRecords)
  } catch (error) {
    /* istanbul ignore next */
    next(error)
  }
}

export const publish_record = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const publishStatus = await publishRecord(
      req.query.cid as string,
      req.query.keyName as string,
      req.body.user.publicKey
    )
    res.status(200).json(publishStatus)
  } catch (error) {
    /* istanbul ignore next */
    next(error)
  }
}

export const remove_key = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const removeStatus = await removeKey(
      req.query.keyName as string,
      req.body.user.publicKey
    )
    res.status(200).json(removeStatus)
  } catch (error) {
    /* istanbul ignore next */
    next(error)
  }
}
