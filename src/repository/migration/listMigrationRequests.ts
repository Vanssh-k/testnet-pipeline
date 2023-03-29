import dbbClient from '../ddbClient'
import { migrationRequestTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (publicKey: string) => {
  try {
    const params = {
      TableName: migrationRequestTable,
      IndexName: 'publicKey-index',
      KeyConditionExpression: 'publicKey = :p',
      ExpressionAttributeValues: {
        ':p': publicKey,
      },
    }

    const record = await dbbClient.query(params)
    const Items = record.Items ?? []
    return Items
  } catch (error) {
    throw new DatabaseError()
  }
}
