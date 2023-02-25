import { v4: uuidv4 }  from 'uuid'
import {
    addProposal,
    allProposals,
}  from '../../../repository/governance/proposals'

exports.createProposal = async (publicKey:string, proposal:string) => {
    try {
        const timestamp = Date.now()
        const _ = await addProposal({
            id: uuidv4().toString(),
            publicKey,
            proposal,
            createdAt: timestamp,
            updatedAt: timestamp,
        })
        return 'Success'
    } catch (error) {
        next(error)
    }
}

exports.listProposals = async () => {
    try {
        return await allProposals()
    } catch (error) {
        next(error)
    }
}
