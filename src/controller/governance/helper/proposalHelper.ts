import { v4 } from 'uuid'
import {
    addProposal,
    allProposals,
} from '../../../repository/governance/proposals'

export const createProposal = async (publicKey: string, proposal: string) => {
    const timestamp = Date.now()
    const _ = await addProposal({
        id: v4().toString(),
        publicKey,
        proposal,
        createdAt: timestamp,
        updatedAt: timestamp,
    })
    return 'Success'
}

export const listProposals = async () => {
    return await allProposals()
}
