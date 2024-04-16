import dbbClient from '../db/ddbClient.js'
import logger from '../../utils/logger.js'
import { userTable } from '../../config/constants.js'
import CustomError from '../../middlewares/error/customError.js'

export default async (publicKey: string, dataLimit: number, faucet: any): Promise<void> => {
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
  } catch (error) {
    logger.error('Update user data limit Error: ' + error)
    throw new CustomError(500, `Internal Server Error.`)
  }
}
