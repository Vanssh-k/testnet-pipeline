import dbbClient from '../ddbClient'
import { ipnsTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (publicKey: string) => {
  try {
    const params = {
      TableName: ipnsTable,
      IndexName: 'publicKey-index',
      KeyConditionExpression: 'publicKey = :p',
      ExpressionAttributeValues: {
        ':p': publicKey,
      },
    }

    const records = await dbbClient.query(params)
    const Items = records.Items ? records.Items : []
    return Items
  } catch (error) {
    throw new DatabaseError()
  }
}
