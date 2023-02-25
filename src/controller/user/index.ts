import { getUploads, updateDataUsage } from './helper/userHelper'
import { cacheFunction } from '../../repository/cacheClient'
import { NextFunction, Request, Response } from 'express'

export const get_uploads = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const fileList = await cacheFunction(
            async () =>
                getUploads(
                    (req?.query?.publicKey as string).trim(),
                    parseInt(req?.query?.pageNo as string, 10)
                ),
            `getUpload-${(req.query.publicKey as string).trim()}-page-${
                req.query.pageNo
            }`
        )
        res.status(200).send(fileList)
    } catch (error) {
        next(error)
    }
}

export const user_data_usage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { user: record } = req as any
        res.status(200).json({
            dataLimit: record.dataLimit,
            dataUsed: record.dataUsed,
        })
    } catch (error) {
        next(error)
    }
}

export const faucet_status = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { user: record } = req as any
        res.status(200).json(record.faucet)
    } catch (error) {
        next(error)
    }
}

export const update_data_usage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { user: record, info } = req as any
        const update = await updateDataUsage(
            record,
            req.query.requestId as string,
            info.enterprise as string
        )
        res.status(200).json(update)
    } catch (error) {
        next(error)
    }
}
