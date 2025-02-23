import dbbClient from '../../db/ddbClient.js'
import logger from '../../../utils/logger.js'
import { Referral } from '../../../types/user.js'
import { referralTable } from '../../../config/constants.js'
import CustomError from '../../../middlewares/error/customError.js'

export default async (usersPublicKey: string): Promise<Referral[] | undefined> => {
  try {
    const params = {
      TableName: referralTable,
      IndexName: 'referredBy-index',
      KeyConditionExpression: 'referredBy = :r',
      ExpressionAttributeValues: {
        ':r': usersPublicKey,
      },
    }

    const record = await dbbClient.query(params)
    return (record.Items as Referral[]) ?? undefined
  } catch (error: any) {
    logger.error('Referral Detail Fetch Error: ' + error.message)
    throw new CustomError(500, `Internal Server Error.`)
  }
}
