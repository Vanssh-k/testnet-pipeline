import dbbClient from '../ddbClient'
import { ProposalTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

const addProposal = async (proposalDetail: string) => {
    try {
        const params: any = {
            TableName: ProposalTable,
            Item: proposalDetail,
        }

        await dbbClient.put(params).promise()
        return 'Put Successful'
    } catch (error) {
        throw new DatabaseError({})
    }
}

const allProposals = async () => {
    try {
        const params = {
            TableName: ProposalTable,
        }

        const record = await dbbClient.scan(params).promise()
        import {Items } = record
        return Items
    } catch (error: any) {
        throw new DatabaseError({})
    }
}

export default { addProposal, allProposals }
