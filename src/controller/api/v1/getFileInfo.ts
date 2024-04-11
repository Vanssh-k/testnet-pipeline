import { Request, Response, NextFunction } from 'express'
import { getFileInfoService } from '../../../services/v1/getFileInfoService.js'

export const getFileInfo = async (req: Request, res: Response, next: NextFunction) => {
  const cid = req.query.cid as string
  const network = req.query.network as string
  try {
    const fileInfo = await getFileInfoService(cid, network)

    if (!fileInfo) {
      return res.status(404).json({ message: 'File info not found' })
    }

    return res.json(fileInfo)
  } catch (error) {
    next(error)
  }
}
