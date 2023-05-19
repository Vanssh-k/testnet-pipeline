import dbbClient from '../db/ddbClient'
import DatabaseError from '../../errors/database-error'
import { fileBundleRecords } from '../../controller/libs/constants'

export default async (cid: string) => {
  try {
    const params = {
      TableName: fileBundleRecords,
      IndexName: 'cid-index',
      KeyConditionExpression: 'cid = :c',
      ExpressionAttributeValues: {
        ':c': cid,
      },
    }

    const record = await dbbClient.query(params)
    return record.Items ?? []
  } catch (error) {
    /* istanbul ignore next */
    throw new DatabaseError()
  }
}
