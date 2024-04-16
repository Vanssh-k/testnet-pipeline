import { NextFunction, Request, Response } from 'express'

export const create_proposal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json('Proposal Added')
  } catch (error) {
    next(error)
  }
}

export const list_proposals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json([])
  } catch (error) {
    next(error)
  }
}
