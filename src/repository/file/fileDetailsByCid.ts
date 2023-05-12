import dbbClient from '../db/ddbClient'
import { fileTable } from '../../controller/libs/constants'

export default async (cid: string) => {
  try {
    const params = {
      TableName: fileTable,
      IndexName: 'cid-index',
      KeyConditionExpression: 'cid = :c',
      ExpressionAttributeValues: {
        ':c': cid,
      },
    }

    const record = await dbbClient.query(params)
    const Items = record.Items ?? []
    return Items[0]
  } catch (error) {
    return null
  }
}
