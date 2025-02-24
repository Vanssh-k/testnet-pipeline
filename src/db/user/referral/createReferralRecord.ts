import { ReferralMap } from '../../../types/user.js'
import CustomError from '../../../middlewares/error/customError.js'
import { referralTable } from '../../../config/constants.js'
import dbbClient from '../../db/ddbClient.js'
import logger from '../../../utils/logger.js'

export default async (details: ReferralMap): Promise<void> => {
  try {
    const params = {
      TableName: referralTable,
      Item: details,
    }

    await dbbClient.put(params)
  } catch (error: any) {
    logger.error('Error create referral record: ' + error)
    throw new CustomError(500, 'Internal Server Error.')
  }
}
