import {
  getMessage,
  getUserKeys,
  verifySigner,
  createApiKey,
  revokeApiKey,
  refreshAccessToken,
} from './helper/authHelper'
import { NextFunction, Response, Request } from 'express'

// Get message - user will sign this message to verify himself
export const get_message = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const message = await getMessage(
      req.query.publicKey as string,
      req.body.network,
      req.body.user,
      req.query.encryption as string
    )
    res.status(200).json(message)
  } catch (error) {
    next(error)
  }
}

// Return access token if user is authentic
export const verify_signer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = await verifySigner(req.body.user)
    res.status(200).json(token)
  } catch (error) {
    next(error)
  }
}

// Return if user is authentic along with his data usage
export const verify_access_token = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const record = req.body.user

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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = refreshAccessToken(req.body.user)
    res.status(200).json(token)
  } catch (error) {
    next(error)
  }
}

export const create_api_key = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const keyName = req.body.keyName ? req.body.keyName : 'key'
    const apiKey = await createApiKey(req.body.user, keyName)
    res.status(200).json(apiKey)
  } catch (error) {
    next(error)
  }
}

export const get_user_keys = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await getUserKeys(req.body.user.publicKey)
    res.status(200).json(data)
  } catch (error) {
    next(error)
  }
}

export const verify_api_key = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const record = req.body.user
    res.status(200).json({
      publicKey: record.publicKey,
      dataLimit: record.dataLimit,
      dataUsed: record.dataUsed,
    })
  } catch (error) {
    next(error)
  }
}

export const remove_api_key = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status = await revokeApiKey(
      req.query.keyId as string,
      req.body.user.publicKey
    )
    res.status(200).send({ data: 'Success' })
  } catch (error) {
    next(error)
  }
}
