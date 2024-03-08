import dbbClient from '../../db/ddbClient'
import DatabaseError from '../../../errors/database-error'
import { TestnetTableName } from '../../../controller/libs/constants'
export default async (cid: string) => {
  try {
    const params = {
      TableName: TestnetTableName.RAAS_TABLE,
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
    console.log('Error getting raas record', error)
    throw new DatabaseError()
  }
}
