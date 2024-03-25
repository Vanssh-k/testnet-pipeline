import { getTicker } from './helper/tickerHelper'
import { cacheClearTime } from '../libs/constants'
import getNetwork from '../../middlewares/getNetwork'
import NotFoundError from '../../errors/not-found-error'
import { NextFunction, Response, Request } from 'express'
import { cacheFunction } from '../../repository/db/cacheClient'
import {
  cidDealStatus,
  bundleDetails,
  podsi,
  podsiTestnet,
  aggregateInfo,
  fileInfoTestnet,
  dealInfoTestnet,
  raasInfoTestnet,
} from './helper/cidHelper'
import fileDetailsByCid from '../../repository/file/fileDetailsByCid'
import {
  pinCID,
  migrationRequest,
  migrationRequestEnt,
} from './helper/migrationHelper'
import migrationRequestInfo from '../../repository/migration/migrationRequestInfo'
import listMigrationRequests from '../../repository/migration/listMigrationRequests'
import cidPinStatus from '../../repository/migration/cidPinStatus'

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

export const get_proof = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let proof
    if (req.query.network === 'testnet') {
      console.log('testnet')
      proof = await podsiTestnet(req.query.cid as string)
      console.log(proof)
    } else {
      // proof = await podsi(req.query.cid as string)
    }
    res.status(200).json(proof)
  } catch (error) {
    console.log('error', error)
    next(error)
  }
}
export const file_info_testnet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let fileInfo
    if (req.query.network === 'testnet') {
      fileInfo = await fileInfoTestnet(req.query.cid as string)
    }
    res.status(200).json(fileInfo)
  } catch (error) {
    console.log(error)
    next(error)
  }
}
export const aggregate_info = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let proof
    if (req.query.network === 'testnet') {
      proof = await aggregateInfo(req.query.aggregateId as string)
    }
    res.status(200).json(proof)
  } catch (error) {
    next(error)
  }
}

export const pin_cid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestID = await pinCID(
      req.body.user,
      req.body.cid,
      req.body.fileName ? req.body.fileName : 'pinned-file',
      req.body.raas
    )
    res.status(200).json({ requestID })
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
      cidStatus: record.cidStatus,
    })
  } catch (error) {
    next(error)
  }
}

export const raas_info = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let raasInfo
    if (req.query.network === 'testnet') {
      raasInfo = await raasInfoTestnet(req.query.cid as string)
    }
    res.status(200).json(raasInfo)
  } catch (error) {
    next(error)
  }
}

export const deal_id = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let dealInfo
    if (req.query.network === 'testnet') {
      dealInfo = await dealInfoTestnet(req.query.dealId as string)
    }
    res.status(200).json(dealInfo)
  } catch (error) {
    next(error)
  }
}

export const cid_pin_status = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pinStatus = await cidPinStatus(req.query.cid as string)
    let pinned = 'failed'
    for (let i = 0; i < pinStatus.length; i++) {
      if (pinStatus[i].cidStatus === 'pinned') {
        pinned = 'pinned'
      }
      if (pinStatus[i].cidStatus === 'queued') {
        pinned = 'queued'
      }
    }
    res.status(200).json(pinned)
  } catch (error) {
    next(error)
  }
}
