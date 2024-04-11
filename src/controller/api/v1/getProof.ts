import { Request, Response, NextFunction } from 'express'
import { getProofService } from '../../../services/v1/getProofService.js'

export const getProof = async (req: Request, res: Response, next: NextFunction) => {
  const cid = req.query.cid as string
  const network = req.query.network as string
  console.log(cid, network)
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
