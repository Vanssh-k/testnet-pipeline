import dbbClient from '../../db/ddbClient.js'
import logger from '../../../utils/logger.js'
import { referralCodeTable } from '../../../config/constants.js'
import CustomError from '../../../middlewares/error/customError.js'
import { ReferralCode } from 'src/types/user.js'

export default async (referralCode: string): Promise<ReferralCode[]> => {
  try {
    const params = {
      TableName: referralCodeTable,
      IndexName: 'referralCode-index',
      KeyConditionExpression: 'referralCode = :r',
      ExpressionAttributeValues: {
        ':r': referralCode,
      },
    }

    const record = await dbbClient.query(params)
    const Items = record.Items ? record.Items : []
    return Items as ReferralCode[]
  } catch (error) {
    logger.error('In checkAPIKey: ' + error)
    throw new CustomError(500, `Internal Server Error.`)
  }
}
