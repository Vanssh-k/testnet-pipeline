import dbbClient from '../../db/ddbClient'
import DatabaseError from '../../../errors/database-error'

export default async (aggregateIn: string) => {
  try {
    const params = {
      TableName: 'testnet-filecoin-deals',
      IndexName: 'aggregateID-index',
      KeyConditionExpression: 'aggregateID = :a',
      ExpressionAttributeValues: {
        ':a': aggregateIn,
      },
    }

    const record = await dbbClient.query(params)
    return record.Items ?? []
  } catch (error) {
    console.log(error)
    /* istanbul ignore next */
    throw new DatabaseError()
  }
}
