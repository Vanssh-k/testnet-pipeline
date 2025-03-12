import { generateKey, getUserIPNSRecords, publishRecord, removeKey } from './helper/ipnsHelper.js'
import { NextFunction, Request, Response } from 'express'

export const generate_key = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ipnsKeyName: { ipnsName: string; ipnsId: string } = await generateKey(req.body.publicKey)
    res.status(200).json(ipnsKeyName)
  } catch (error) {
    next(error)
  }
}

export const get_ipns_records = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ipnsRecords: any[] = await getUserIPNSRecords(req.body.publicKey)
    res.status(200).json(ipnsRecords)
  } catch (error) {
    next(error)
  }
}

export const publish_record = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const publishStatus: any = await publishRecord(
      req.query.cid as string,
      req.query.keyName as string,
      req.body.publicKey,
    )
    res.status(200).json(publishStatus)
  } catch (error) {
    next(error)
  }
}

export const remove_key = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const removeStatus: any = await removeKey(req.query.keyName as string, req.body.publicKey)
    res.status(200).json(removeStatus)
  } catch (error) {
    next(error)
  }
}
