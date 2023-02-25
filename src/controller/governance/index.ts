import { NextFunction, Request, Response } from 'express'
import { createProposal, listProposals } from './helper/proposalHelper'

export const create_proposal = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        import {proposal, publicKey } = req.body
        createProposal(publicKey, proposal)
        res.status(200).json('Proposal Added')
    } catch (error) {
        next(error)
    }
}

export const list_proposals = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const proposals = await listProposals()
        res.status(200).json(proposals)
    } catch (error) {
        next(error)
    }
}
