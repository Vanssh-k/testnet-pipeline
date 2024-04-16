import { Request, Response, NextFunction } from 'express'
import { getDealInfoService } from './helper/getDealInfoService.js'
import { getFileInfoService } from './helper/getFileInfoService.js'
import { getProofService } from './helper/getProofService.js'
import { getRaasInfoService } from './helper/getRaasInfoService.js'
import { getFileDetailsService } from './helper/getFileDetailsService.js'
import { getCache, setExCache } from '../../db/db/cacheClient.js'
import { V1CacheTime } from '../../config/constants.js'
import responseParser from '../../utils/responseParser.js'
export const get_deal_info = async (req: Request, res: Response, next: NextFunction) => {
  const dealId = req.query.dealId as string
  const network = req.query.network as string

  try {
    let record = await getCache(`deal-info-${dealId}-${network}`)
    if (!record) {
      record = await getDealInfoService(dealId, network)
      await setExCache(`deal-info-${dealId}-${network}`, V1CacheTime, record)
    }
    if (!record) {
      return res.status(404).json({ message: 'Deal info not found' })
    }

    return res.status(200).json(responseParser(record))
  } catch (error) {
    next(error)
  }
}

export const get_file_details = async (req: Request, res: Response, next: NextFunction) => {
  const cid = req.query.cid as string
  const network = req.query.network as string

  try {
    let record = await getCache(`file-details-${cid}-${network}`)
    if (!record) {
      record = await getFileDetailsService(cid, network)
      await setExCache(`file-details-${cid}-${network}`, V1CacheTime, record)
    }
    if (!record) {
      return res.status(404).json({ message: 'File details not found' })
    }

    return res.status(200).json(responseParser(record))
  } catch (error) {
    next(error)
  }
}

export const get_file_info = async (req: Request, res: Response, next: NextFunction) => {
  const cid = req.query.cid as string
  const network = req.query.network as string
  try {
    let record = await getCache(`file-info-${cid}-${network}`)
    if (!record) {
      record = await getFileInfoService(cid, network)
      await setExCache(`file-info-${cid}-${network}`, V1CacheTime, record)
    }
    if (!record) {
      return res.status(404).json({ message: 'File info not found' })
    }

    return res.status(200).json(responseParser(record))
  } catch (error) {
    next(error)
  }
}

export const get_proof = async (req: Request, res: Response, next: NextFunction) => {
  const cid = req.query.cid as string
  const network = req.query.network as string

  try {
    let record = await getCache(`proof-${cid}-${network}`)
    if (!record) {
      record = await getProofService(cid, network)
      await setExCache(`proof-${cid}-${network}`, V1CacheTime, record)
    }
    if (!record) {
      return res.status(404).json({ message: 'Proof not found' })
    }

    return res.status(200).json(responseParser(record))
  } catch (error) {
    next(error)
  }
}

export const get_raas_info = async (req: Request, res: Response, next: NextFunction) => {
  const cid = req.query.cid as string
  const network = req.query.network as string

  try {
    let record = await getCache(`raas-info-${cid}-${network}`)
    if (!record) {
      record = await getRaasInfoService(cid, network)
      await setExCache(`raas-info-${cid}-${network}`, V1CacheTime, record)
    }
    if (!record) {
      return res.status(404).json({ message: 'RAAS info not found' })
    }

    return res.status(200).json(responseParser(record))
  } catch (error) {
    next(error)
  }
}
