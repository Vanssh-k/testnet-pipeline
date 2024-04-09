import dbbClient from '../db/ddbClient'
import { migrationCIDs } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (requestID: string) => {
  try {
    const params = {
      TableName: migrationCIDs,
      IndexName: 'requestID-index',
      KeyConditionExpression: 'requestID = :r',
      ExpressionAttributeValues: {
        ':r': requestID,
      },
    }

    const record = await dbbClient.query(params)
    const Items = record.Items ?? []
    return Items
  } catch (error) {
    throw new DatabaseError()
  }
}
