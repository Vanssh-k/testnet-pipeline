import {
  getUploads,
  createTagHelper,
  getTagDetailsHelper,
  getAllTagsHelper,
  removeTagHelper,
} from './helper/userHelper.js'
import { NextFunction, Request, Response } from 'express'
import updateEmail from '../../db/user/updateEmail.js'
import { generateTokenAndSendMail, verifyEmailToken } from './helper/verifyEmail.js'
import CustomError from '../../middlewares/error/customError.js'

export const get_uploads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fileList = await getUploads(req.body.user.publicKey as string, req.query.lastKey as string)
    res.status(200).send(fileList)
  } catch (error) {
    next(error)
  }
}

export const files_uploaded = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fileList = await getUploads(req.body.user.publicKey as string, req.query.lastKey as string)

    res.status(200).send({
      fileList: fileList,
      totalFiles: req.body.user.fileCount,
    })
  } catch (error) {
    next(error)
  }
}

export const user_data_usage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      dataLimit: req.body.user.dataLimit,
      dataUsed: req.body.user.dataUsed,
    })
  } catch (error) {
    next(error)
  }
}

export const send_email_verification_mail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = await generateTokenAndSendMail(req.body.publicKey as string, req.query.email as string)
    res.status(200).send(status)
  } catch (error) {
    next(error)
  }
}

export const verify_email_token = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = await verifyEmailToken((req.query.verification_token as string).trim())
    res.status(200).send(status)
  } catch (error) {
    next(error)
  }
}

export const verify_web3auth_email = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const app_pub_key = req.query.appPubKey as string
    const idToken = req.query.idToken as string
    const email = req.query.email as string

    if (!idToken || !app_pub_key) {
      throw new CustomError(400, 'Invalid token.')
    }
    await updateEmail(req.body.publicKey as string, email)
    res.status(200).json({ name: 'Verification Successful' })
  } catch (error) {
    next(error)
  }
}

export const create_tag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await createTagHelper(req.body.tag, req.body.cid, req.body.publicKey)
    return res.status(200).json('Success')
  } catch (error: any) {
    next(error)
  }
}

export const get_tag_details = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tagDetails = await getTagDetailsHelper(req.query.tag as string, req.body.publicKey)
    return res.status(200).json({ data: tagDetails })
  } catch (error) {
    next(error)
  }
}

export const get_all_tags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tagDetails = await getAllTagsHelper(req.body.publicKey)
    return res.status(200).json({ data: tagDetails })
  } catch (error: any) {
    next(error)
  }
}

export const remove_tag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await removeTagHelper(req.query.tag as string, req.body.publicKey)
    return res.status(200).json('Success')
  } catch (error) {
    next(error)
  }
}
