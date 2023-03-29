import dbbClient from '../ddbClient'
import { ProposalTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

const addProposal = async (proposalDetail: any) => {
  try {
    const params: any = {
      TableName: ProposalTable,
      Item: proposalDetail,
    }

    await dbbClient.put(params)
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

    const record = await dbbClient.scan(params)
    const { Items } = record
    return Items
  } catch (error: any) {
    throw new DatabaseError({})
  }
}

export { addProposal, allProposals }
