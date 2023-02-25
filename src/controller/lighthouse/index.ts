import getNetwork from '../../middlewares/getNetwork'
import listMigrationRequests from '../../repository/migration/listMigrationRequests'
import migrationRequestInfo from '../../repository/migration/migrationRequestInfo'
import fileDetailsByCid from '../../repository/fileDetailsByCid'
import { cacheFunction } from '../../repository/cacheClient'
import { getTicker } from './helper/tickerHelper'
import NotFoundError from '../../errors/not-found-error'
import { cidDealStatus, addCidEstuary, addCidToQueue } from './helper/cidHelper'
import { migrationRequest, migrationRequestEnt } from './helper/migrationHelper'
import { NextFunction, Response } from 'express'

// get ticker of a token by its symbol as input
export const get_ticker = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const tokenPricesUSD = await getTicker(req.query.symbol)
        res.status(200).json(tokenPricesUSD)
    } catch (error) {
        next(error)
    }
}

// get status of a CID, returns filecoin miner details
export const deal_status = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const status = await cidDealStatus(req.query.cid)
        res.status(200).json(status)
    } catch (error) {
        next(error)
    }
}

// create db record for all CID and trigger migration
export const migration_request = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const requestID = await migrationRequest(req.user, req.body.data)
        res.status(200).json({ requestID })
    } catch (error) {
        next(error)
    }
}

export const migration_request_ent = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        let publicKey = req.body.publicKey.trim()
        if (req.network === 'evm') {
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
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        let publicKey = req.query.publicKey.trim()
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
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const record = await migrationRequestInfo(req.query.requestId)
        res.status(200).json(record)
    } catch (error) {
        next(error)
    }
}

// add cid for filecoin deal
export const add_cid = async (req: any, res: Response, next: NextFunction) => {
    try {
        await addCidEstuary(req.body.name, req.body.cid)
        res.status(200).json('Added To Queue')
    } catch (error) {
        next(error)
    }
}

// Get details of a file
export const file_info = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const record = await cacheFunction(
            async () => fileDetailsByCid(req.query.cid),
            `cid-${req.query.cid}`
        )
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

// Add file to queue for bundled transaction
export const add_cid_to_queue = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const response = await addCidToQueue(req.user, req.body)
        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}
