import { getUploads, updateDataUsage, getUserFiles } from './helper/userHelper'
import { NextFunction, Request, Response } from 'express'
import models from '../../repository/db'

export const get_uploads = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fileList = await getUploads(
      (req?.query?.publicKey as string).trim(),
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
      (req?.query?.publicKey as string).trim(),
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

export const getFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const temp: any = await models.filesModel.getOne({
      tag: req.body?.tag ?? req.query?.tag,
      address:
        req?.body?.user?.publicKey ?? req.body?.address ?? req.query?.address,
    })
    return res.status(200).json({ cid: temp?.cid })
  } catch (error) {
    next(error)
  }
}

export const updateTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await models.filesModel.updateOrCreate(
      {
        cid: req.body.cid,
        address: req?.body?.user?.publicKey ?? req.body.address,
      },
      req.body
    )

    return res.status(200).json({ ...data })
  } catch (error) {
    console.log(error)
    next(error)
  }
}
