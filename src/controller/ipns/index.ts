import axios from 'axios'
import config from '../../config'
import {
  generateKey,
  getUserIPNSRecords,
  publishRecord
} from './helper/ipnsHelper'
import { NextFunction, Request, Response } from 'express'

export const generate_key = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
      const ipnsKeyName = await generateKey(req.user.publicKey)      
      res.status(200).json(ipnsKeyName)
  } catch (error) {
      next(error)
  }
}

export const get_ipns_records = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
      const ipnsRecords = await getUserIPNSRecords(req.user.publicKey)      
      res.status(200).json(ipnsRecords)
  } catch (error) {
      next(error)
  }
}

export const publish_record = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
      const status = await publishRecord(req.query.cid, req.query.keyName, req.user.publicKey)
      res.status(200).json('Published')
    } catch (error) {
        next(error)
    }
}
