import dbbClient from '../db/ddbClient'
import { userTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (publicKey: string, timestamp: number) => {
  try {
    const params = {
      TableName: userTable,
      Key: {
        publicKey,
      },
      UpdateExpression: 'set message = :u',
      ExpressionAttributeValues: {
        ':u': timestamp,
      },
    }

    await dbbClient.update(params)
    return 'Update Successful'
  } catch (error) {
    throw new DatabaseError({})
  }
}
