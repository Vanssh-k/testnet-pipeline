import { getTicker } from './helper/tickerHelper'
import { cacheClearTime } from '../libs/constants'
import getNetwork from '../../middlewares/getNetwork'
import NotFoundError from '../../errors/not-found-error'
import { NextFunction, Response, Request } from 'express'
import { cacheFunction } from '../../repository/db/cacheClient'
import { cidDealStatus, bundleDetails } from './helper/cidHelper'
import fileDetailsByCid from '../../repository/file/fileDetailsByCid'
import { migrationRequest, migrationRequestEnt } from './helper/migrationHelper'
import migrationRequestInfo from '../../repository/migration/migrationRequestInfo'
import listMigrationRequests from '../../repository/migration/listMigrationRequests'

// get ticker of a token by its symbol as input
export const get_ticker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokenPricesUSD = await getTicker(req.query.symbol as string)
    res.status(200).json(tokenPricesUSD)
  } catch (error) {
    next(error)
  }
}

// get status of a CID, returns filecoin miner details
export const deal_status = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check cache
    // const status = await cacheFunction(
    //   async () => cidDealStatus(req.query.cid as string),
    //   `dealStatus-${req.query.cid}`,
    //   cacheClearTime.day
    // )
    const status = await cidDealStatus(req.query.cid as string)
    res.status(200).json(status)
  } catch (error) {
    next(error)
  }
}

export const bundle_details = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status = await bundleDetails(req.query.bundleId as string)
    res.status(200).json(status)
  } catch (error) {
    next(error)
  }
}

// create db record for all CID and trigger migration
export const migration_request = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestID = await migrationRequest(req.body.user, req.body.data)
    res.status(200).json({ requestID })
  } catch (error) {
    next(error)
  }
}

export const migration_request_ent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let publicKey = req.body.publicKey.trim()
    if (req.body.network === 'evm') {
      publicKey = publicKey.toLowerCase()
    }
    const requestID = await migrationRequestEnt(
      publicKey,
      req.body.data,
      req.body.enterprise
    )

    res.status(200).json({ requestID })
  } catch (error) {
    next(error)
  }
}

export const list_migration_requests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let publicKey = (req.query.publicKey as string).trim()
    const network = getNetwork(publicKey)
    if (network === 'evm') {
      publicKey = publicKey.toLowerCase()
    }

    const record = await listMigrationRequests(publicKey)
    res.status(200).json(record)
  } catch (error) {
    next(error)
  }
}

export const migration_request_info = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const record = await migrationRequestInfo(req.query.requestId as string)
    res.status(200).json(record)
  } catch (error) {
    next(error)
  }
}

// Get details of a file
export const file_info = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const record = await cacheFunction(
    //   async () => fileDetailsByCid(req.query.cid as string),
    //   `cid-${req.query.cid}`,
    //   cacheClearTime.day
    // )
    const record = await fileDetailsByCid(req.query.cid as string)
    if (!record) {
      throw new NotFoundError()
    }

    res.status(200).json({
      fileSizeInBytes: record.fileSizeInBytes,
      cid: record.cid,
      encryption: record.encryption,
      fileName: record.fileName,
      mimeType: record.mimeType,
      txHash: record.txHash,
      cidStatus: record.cidStatus,
    })
  } catch (error) {
    next(error)
  }
}
