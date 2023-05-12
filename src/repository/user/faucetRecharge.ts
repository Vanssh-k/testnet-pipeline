import dbbClient from '../db/ddbClient'
import { userTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (publicKey: string, dataLimit: number, faucet: any) => {
  try {
    const params = {
      TableName: userTable,
      Key: {
        publicKey,
      },
      UpdateExpression: 'set dataLimit = :d, faucet = :f, updatedAt = :u',
      ExpressionAttributeValues: {
        ':d': dataLimit,
        ':f': faucet,
        ':u': Date.now(),
      },
    }

    await dbbClient.update(params)
    return 'Update Successful'
  } catch (error) {
    throw new DatabaseError()
  }
}
