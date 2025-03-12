import { getTicker } from './helper/tickerHelper.js'
import getNetwork from '../../middlewares/getNetwork.js'
import CustomError from '../../middlewares/error/customError.js'
import { NextFunction, Response, Request } from 'express'
import { cidDealStatus } from './helper/cidHelper.js'
import fileDetailsByCid from '../../db/file/fileDetailsByCid.js'
import { pinCID, migrationRequest, retryMigration } from './helper/migrationHelper.js'
import migrationRequestInfo from '../../db/migration/migrationRequestInfo.js'
import listMigrationRequests from '../../db/migration/listMigrationRequests.js'
import cidPinStatus from '../../db/migration/cidPinStatus.js'
import { getCache, removeCache, setExCache } from '../../db/db/cacheClient.js'
import { MigrationStatus } from '../../types/status.js'

// get ticker of a token by its symbol as input
export const get_ticker = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tokenPricesUSD: number = await getTicker(req.query.symbol as string)
    res.status(200).json(tokenPricesUSD)
  } catch (error) {
    next(error)
  }
}

// get status of a CID, returns filecoin miner details
export const deal_status = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const status = await cidDealStatus(req.query.cid as string)
    res.status(200).json(status)
  } catch (error) {
    next(error)
  }
}

export const pin_cid = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requestID: string = await pinCID(
      req.body.user,
      req.body.cid,
      req.body.fileName ? req.body.fileName : 'pinned-file',
    )
    await removeCache(`migration-requests-${req.body.publicKey}`)
    res.status(200).json({ requestID })
  } catch (error) {
    next(error)
  }
}

// create db record for all CID and trigger migration
export const migration_request = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const requestID: string = await migrationRequest(req.body.user, req.body.data)
    await removeCache(`migration-requests-${req.body.user.publicKey}`)
    res.status(200).json({ requestID })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const list_migration_requests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let publicKey: string = (req.query.publicKey as string).trim()
    const network: string = getNetwork(publicKey)
    if (network === 'evm') {
      publicKey = publicKey.toLowerCase()
    }

    let record = await getCache(`migration-requests-${publicKey}`)
    if (!record) {
      record = await listMigrationRequests(publicKey)
      await setExCache(`migration-requests-${publicKey}`, 300, record)
    }

    res.status(200).json(record)
  } catch (error) {
    next(error)
  }
}

export const retry_migration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const status = await retryMigration(req.query.requestId as string)
    res.status(200).json(status)
  } catch (error) {
    next(error)
  }
}

export const migration_request_info = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let record = await getCache(`migration-req-info-${req.query.requestId?.toLocaleString()}`)
    if (!record) {
      record = await migrationRequestInfo(req.query.requestId as string)
      await setExCache(`migration-req-info-${req.query.requestId?.toLocaleString()}`, 300, record)
    }

    res.status(200).json(record)
  } catch (error) {
    next(error)
  }
}

// Get details of a file
export const file_info = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let record = await getCache(`cid-${req.query.cid?.toLocaleString()}`)
    if (!record) {
      record = await fileDetailsByCid(req.query.cid as string)
      if (!record) {
        throw new CustomError(404, 'Not Found')
      }
      setExCache(`cid-${req.query.cid?.toLocaleString()}`, 300, {
        fileSizeInBytes: record.fileSizeInBytes,
        cid: record.cid,
        encryption: record.encryption,
        fileName: record.fileName,
        mimeType: record.mimeType,
      })
    }

    res.status(200).json({
      fileSizeInBytes: record.fileSizeInBytes,
      cid: record.cid,
      encryption: record.encryption,
      fileName: record.fileName,
      mimeType: record.mimeType,
    })
  } catch (error) {
    next(error)
  }
}

export const cid_pin_status = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const pinStatus = await cidPinStatus(req.query.cid as string)
    let pinned: string = 'failed'
    let fileSize: string = '0'
    let requestId: string = ''
    for (let i = 0; i < pinStatus.length; i++) {
      if (pinStatus[i].cidStatus === MigrationStatus.Pinned) {
        pinned = 'pinned'
        fileSize = pinStatus[i].fileSizeInBytes.toString()
        requestId = pinStatus[i].requestID
        break
      }
      pinned = pinStatus[i].cidStatus
      requestId = pinStatus[i].requestID
      fileSize = pinStatus[i].fileSizeInBytes.toString()
    }

    if (req.query.requestId) {
      res.status(200).json({
        status: pinned,
        fileSize: fileSize,
        requestId: requestId,
      })
    } else {
      res.status(200).json({
        status: pinned,
        fileSize: fileSize,
      })
    }
  } catch (error) {
    next(error)
  }
}
