import { Request, Response, NextFunction } from 'express'
import { getDealInfoService } from '../../../services/v1/getDealInfoService.js'

export const getDealInfo = async (req: Request, res: Response, next: NextFunction) => {
  const dealId = req.query.dealId as string
  const network = req.query.network as string

  try {
    const dealInfo = await getDealInfoService(dealId, network)

    if (!dealInfo) {
      return res.status(404).json({ message: 'Deal info not found' })
    }

    return res.json(dealInfo)
  } catch (error) {
    next(error)
  }
}
