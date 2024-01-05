import dbbClient from '../db/ddbClient'
import { userTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (publicKey: string, email: string) => {
  try {
    const params = {
      TableName: userTable,
      Key: {
        publicKey,
      },
      UpdateExpression: 'set email = :e, updatedAt = :u',
      ExpressionAttributeValues: {
        ':e': email,
        ':u': Date.now(),
      },
    }

    await dbbClient.update(params)
    return 'Update Successful'
  } catch (error) {
    throw new DatabaseError({})
  }
}
