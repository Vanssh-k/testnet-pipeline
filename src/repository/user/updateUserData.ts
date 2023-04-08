import dbbClient from '../ddbClient'
import { userTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (publicKey: string, fileSize: number) => {
  try {
    const params = {
      TableName: userTable,
      Key: {
        publicKey,
      },
      UpdateExpression: 'set dataUsed = dataUsed + :d, fileCount = fileCount + :f, updatedAt = :u',
      ExpressionAttributeValues: {
        ':d': fileSize,
        ':f': 1,
        ':u': Date.now(),
      },
    }

    await dbbClient.update(params)
    return 'Update Successful'
  } catch (error) {
    throw new DatabaseError({})
  }
}
