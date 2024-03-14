import dbbClient from '../../db/ddbClient'
import DatabaseError from '../../../errors/database-error'
import { TestnetTableName } from '../../../controller/libs/constants'

export default async (dealId: string) => {
  try {
    const params = {
      TableName: TestnetTableName.DEAL_RECORD_TABLE,
      IndexName: 'chainDealID-index',
      KeyConditionExpression: 'chainDealID = :d',
      ExpressionAttributeValues: {
        ':d': Number(dealId),
      },
    }

    const record = await dbbClient.query(params)
    return record.Items ?? []
  } catch (error) {
    /* istanbul ignore next */
    console.error('Error getting deal record', error)
    throw new DatabaseError()
  }
}
