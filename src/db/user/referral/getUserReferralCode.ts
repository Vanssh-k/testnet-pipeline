import dbbClient from '../../db/ddbClient.js'
import logger from '../../../utils/logger.js'
import { referralCodeTable } from '../../../config/constants.js'
import CustomError from '../../../middlewares/error/customError.js'
import { Referral } from 'src/types/user.js'

export default async (usersPublicKey: string): Promise<Referral | null> => {
  try {
    const params = {
      TableName: referralCodeTable,
      Key: {
        publicKey: usersPublicKey,
      },
    }

    const record = await dbbClient.get(params)
    return (record.Item as Referral) ?? null
  } catch (error: any) {
    logger.error('Referral Detail Fetch Error: ' + error.message)
    throw new CustomError(500, `Internal Server Error.`)
  }
}
