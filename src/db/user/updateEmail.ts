import dbbClient from '../db/ddbClient.js'
import logger from '../../utils/logger.js'
import { userTable } from '../../config/constants.js'
import CustomError from '../../middlewares/error/customError.js'

export default async (publicKey: string, email: string): Promise<void> => {
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
  } catch (error) {
    logger.error('Update user email: ' + error)
    throw new CustomError(500, `Error updating user email.`)
  }
}
