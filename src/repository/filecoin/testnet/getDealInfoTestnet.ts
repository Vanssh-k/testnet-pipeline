import dbbClient from '../../db/ddbClient'
import DatabaseError from '../../../errors/database-error'
import { TestnetTableName } from '../../../controller/libs/constants'
export default async (dealId: string) => {
  try {
    const params = {
      TableName: TestnetTableName.DEAL_RECORD_TABLE,
      FilterExpression: 'chainDealID = :c',
      ExpressionAttributeValues: {
        ':c': Number(dealId),
      },
    }

    const record = await dbbClient.scan(params)
    return record.Items ?? []
  } catch (error) {
    /* istanbul ignore next */
    console.error('Error getting deal record', error)
    throw new DatabaseError()
  }
}
