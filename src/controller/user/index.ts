import {
  getUploads,
  getUserFiles,
  createTagHelper,
  getTagDetailsHelper,
  getAllTagsHelper,
  removeTagHelper,
} from './helper/userHelper'
import logger from '../../utils/logger'
import { NextFunction, Request, Response } from 'express'
import {
  generateTokenAndSendMail,
  verifyEmailToken,
} from './helper/verifyEmail'
import * as jose from 'jose'
import updateEmail from '../../repository/user/updateEmail'

export const get_uploads = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fileList = await getUploads(
      (req.body.user.publicKey as string).trim(),
      parseInt(req?.query?.pageNo as string, 10)
    )

    res.status(200).send(fileList)
  } catch (error) {
    next(error)
  }
}

export const files_uploaded = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Only cache first page
    const fileList = await getUserFiles(
      (req.body.user.publicKey as string).trim(),
      parseInt(req?.query?.pageNo as string, 10)
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
    const user = req.body.user
    res.status(200).json({
      dataLimit: user.dataLimit,
      dataUsed: user.dataUsed,
    })
  } catch (error) {
    /* istanbul ignore next */
    next(error)
  }
}

export const faucet_status = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.body.user
    res.status(200).json(user.faucet)
  } catch (error) {
    /* istanbul ignore next */
    next(error)
  }
}

export const get_tag_details = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tagDetails = await getTagDetailsHelper(
      req.query.tag as string,
      req.body.user.publicKey
    )
    return res.status(200).json({ data: tagDetails })
  } catch (error) {
    next(error)
  }
}

export const remove_tag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await removeTagHelper(
      req.query.tag as string,
      req.body.user.publicKey
    )
    return res.status(200).json('Success')
  } catch (error) {
    next(error)
  }
}

export const get_all_tags = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tagDetails = await getAllTagsHelper(req.body.user.publicKey)
    return res.status(200).json({ data: tagDetails })
  } catch (error: any) {
    next(error)
  }
}

export const create_tag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await createTagHelper(
      req.body.tag,
      req.body.cid,
      req.body.user.publicKey
    )
    return res.status(200).json(response)
  } catch (error: any) {
    const myLogger = logger('error', 'user')
    myLogger.error(
      'In create_tag, create tag failed for tag: ' +
        req.body.tag +
        ' error: ' +
        error.message
    )
    next(error)
  }
}

export const send_email_verification_mail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status = await generateTokenAndSendMail(
      (req.body.user.publicKey as string).trim(),
      req.query.email as string
    )

    res.status(200).send(status)
  } catch (error) {
    next(error)
  }
}

export const verify_email_token = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status = await verifyEmailToken(
      (req.query.verification_token as string).trim()
    )
    res.status(200).send(status)
  } catch (error) {
    next(error)
  }
}

export const verify_web3auth_token = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const idToken = req.headers.authorization?.split(' ')[1]
    const app_pub_key = req.body.appPubKey
    const jwks = jose.createRemoteJWKSet(
      new URL('https://api-auth.web3auth.io/jwks')
    )
    const jwtDecoded = await jose.jwtVerify(idToken as string, jwks, {
      algorithms: ['ES256'],
    })

    if (
      (jwtDecoded.payload as any).wallets[0].public_key.toLowerCase() ===
      app_pub_key.toLowerCase()
    ) {
      // Verified
      updateEmail(app_pub_key.toLowerCase(), (jwtDecoded.payload as any).email)

      res.status(200).json({ name: 'Verification Successful' })
    } else {
      res.status(400).json({ name: 'Verification Failed' })
    }
  } catch (error) {
    next(error)
  }
}
