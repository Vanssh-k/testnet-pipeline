import { Request, Response, NextFunction } from 'express'
import { getDealInfoService } from './helper/getDealInfoService.js'
import { getFileInfoService } from './helper/getFileInfoService.js'
import { getProofService } from './helper/getProofService.js'
import { getRaasInfoService } from './helper/getRaasInfoService.js'

export const get_deal_info = async (req: Request, res: Response, next: NextFunction) => {
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

export const get_file_info = async (req: Request, res: Response, next: NextFunction) => {
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

export const get_proof = async (req: Request, res: Response, next: NextFunction) => {
  const cid = req.query.cid as string
  const network = req.query.network as string
  try {
    const proof = await getProofService(cid, network)

    if (!proof) {
      return res.status(404).json({ message: 'Proof not found' })
    }

    return res.json(proof)
  } catch (error) {
    next(error)
  }
}

export const get_raas_info = async (req: Request, res: Response, next: NextFunction) => {
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
