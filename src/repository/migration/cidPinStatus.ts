import dbbClient from '../db/ddbClient'
import { migrationCIDs } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (cid: string) => {
  try {
    const params = {
      TableName: migrationCIDs,
      IndexName: 'cid-index',
      KeyConditionExpression: 'cid = :c',
      ExpressionAttributeValues: {
        ':c': cid,
      },
    }

    const record = await dbbClient.query(params)
    const Items = record.Items ?? []
    return Items
  } catch (error) {
    console.log(error)
    throw new DatabaseError()
  }
}
