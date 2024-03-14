import dbbClient from '../../db/ddbClient'
import DatabaseError from '../../../errors/database-error'
import { MainnetTableName } from '../../../controller/libs/constants'
export default async (cid: string) => {
  try {
    const params = {
      TableName: MainnetTableName.FILE_RECORD_TABLE,
      // IndexName: 'cid-index',
      FilterExpression: 'cid = :c',
      // KeyConditionExpression: 'cid = :c',
      ExpressionAttributeValues: {
        ':c': cid,
      },
    }
    const record = await dbbClient.scan(params)
    // const record = await dbbClient.query(params)
    return record.Items ?? []
  } catch (error) {
    /* istanbul ignore next */
    throw new DatabaseError()
  }
}
