import { tweetRecharge } from './helper/tweetHelper'
import {
    getMessage,
    verifySigner,
    refreshAccessToken,
    removeRefreshToken,
    getApiKey,
} from './helper/authHelper'
import { NextFunction, Response, Request } from 'express'

// Get message - user will sign this message to verify himself
export const get_message = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const message = await getMessage(
            req.query.publicKey,
            req.network,
            req.user
        )
        res.status(200).json(message)
    } catch (error) {
        next(error)
    }
}

// Return access token if user is authentic
export const verify_signer = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const record = req.user
        const token = await verifySigner(record)
        res.status(200).json(token)
    } catch (error) {
        next(error)
    }
}

// Return if user is authentic along with his data usage
export const verify_access_token = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const record = req.user

        res.status(200).json({
            publicKey: record.publicKey,
            dataLimit: record.dataLimit,
            dataUsed: record.dataUsed,
        })
    } catch (error) {
        next(error)
    }
}

export const refresh_access_token = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const newAccessToken = refreshAccessToken(req.user)
        res.status(200).json(newAccessToken)
    } catch (error) {
        next(error)
    }
}

export const remove_refresh_token = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const response = removeRefreshToken(req.user)
        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}

export const get_api_key = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const apiKey = await getApiKey(req.user)
        res.status(200).json(apiKey)
    } catch (error) {
        next(error)
    }
}

export const verify_api_key = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const record = req.user
        res.status(200).json({
            publicKey: record.publicKey,
            dataLimit: record.dataLimit,
            dataUsed: record.dataUsed,
        })
    } catch (error) {
        next(error)
    }
}

export const tweet_recharge = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        await tweetRecharge(req.user, req.query.twitterID)
        res.status(200).json('Data Limit Upgraded')
    } catch (error) {
        next(error)
    }
}
