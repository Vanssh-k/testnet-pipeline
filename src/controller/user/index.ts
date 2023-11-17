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
