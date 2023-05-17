import dbbClient from '../db/ddbClient'
import { cidTagTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (publicKey: string) => {
  try {
    const params = {
      TableName: cidTagTable,
      IndexName: 'publicKey-index',
      KeyConditionExpression: 'publicKey = :p',
      ExpressionAttributeValues: {
        ':p': publicKey,
      },
    }

    const record = await dbbClient.query(params)
    const Items = record.Items
    return Items
  } catch (error: any) {
    throw new DatabaseError()
  }
}
