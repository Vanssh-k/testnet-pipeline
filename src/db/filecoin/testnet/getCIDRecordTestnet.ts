import dbbClient from '../../db/ddbClient'
import DatabaseError from '../../../errors/database-error'

export default async (cid: string) => {
  try {
    const params = {
      TableName: 'testnet-file-aggregate-info',
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
