import { Request, Response, NextFunction } from 'express'
import { getRaasInfoService } from '../../../services/v1/getRaasInfoService.js'

export const getRaasInfo = async (req: Request, res: Response, next: NextFunction) => {
  const cid = req.query.cid as string
  const network = req.query.network as string

  try {
    const raasInfo = await getRaasInfoService(cid, network)

    if (!raasInfo) {
      return res.status(404).json({ message: 'RAAS info not found' })
    }

    return res.json(raasInfo)
  } catch (error) {
    next(error)
  }
}
