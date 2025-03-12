import dbbClient from '../../db/ddbClient.js'
import logger from '../../../utils/logger.js'
import { referralCodeTable } from '../../../config/constants.js'
import CustomError from '../../../middlewares/error/customError.js'

export default async (publicKey: string, referralCode: string): Promise<string> => {
  try {
    const params = {
      TableName: referralCodeTable,
      Key: {
        publicKey,
      },
      UpdateExpression: 'set referralCode = :r, updatedAt = :u',
      ExpressionAttributeValues: {
        ':r': referralCode,
        ':u': Date.now(),
      },
    }

    await dbbClient.update(params)
    return 'Update Successful'
  } catch (error) {
    logger.error('Update user data: ' + error)
    throw new CustomError(500, `Internal Server Error.`)
  }
}
