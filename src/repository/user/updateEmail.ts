import dbbClient from '../db/ddbClient'
import { userTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (publicKey: string, email: { email: string }) => {
  try {
    const params = {
      TableName: userTable,
      Key: {
        publicKey,
      },
      UpdateExpression: 'set profile = :p, updatedAt = :u',
      ExpressionAttributeValues: {
        ':p': email,
        ':u': Date.now(),
      },
    }

    await dbbClient.update(params)
    return 'Update Successful'
  } catch (error) {
    throw new DatabaseError({})
  }
}
