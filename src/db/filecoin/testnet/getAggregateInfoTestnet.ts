import dbbClient from '../../db/ddbClient'
import DatabaseError from '../../../errors/database-error'
import { TestnetTableName } from '../../../controller/libs/constants'
export default async (id: string) => {
  try {
    const params = {
      TableName: TestnetTableName.AGGREGATE_TABLE,
      IndexName: 'aggregateID-index',
      KeyConditionExpression: 'aggregateID = :c',
      ExpressionAttributeValues: {
        ':c': id,
      },
    }

    const record = await dbbClient.query(params)
    return record.Items ?? []
  } catch (error) {
    /* istanbul ignore next */
    throw new DatabaseError()
  }
}
