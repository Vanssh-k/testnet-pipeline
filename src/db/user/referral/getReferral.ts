import dbbClient from '../../db/ddbClient.js'
import logger from '../../../utils/logger.js'
import { ReferralMap } from '../../../types/user.js'
import { referralTable } from '../../../config/constants.js'
import CustomError from '../../../middlewares/error/customError.js'

export default async (usersPublicKey: string): Promise<ReferralMap> => {
  try {
    const params = {
      TableName: referralTable,
      Key: {
        publicKey: usersPublicKey,
      },
    }

    const record = await dbbClient.get(params)
    return (record.Item as ReferralMap) ?? {}
  } catch (error: any) {
    logger.error('Referral Detail Fetch Error: ' + error.message)
    throw new CustomError(500, `Internal Server Error.`)
  }
}
