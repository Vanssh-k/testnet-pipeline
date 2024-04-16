import dbbClient from '../db/ddbClient.js'
import logger from '../../utils/logger.js'
import { ipnsTable } from '../../config/constants.js'
import CustomError from '../../middlewares/error/customError.js'

export default async (key: string): Promise<void> => {
  try {
    const params = {
      TableName: ipnsTable,
      Key: {
        ipnsName: key,
      },
    }

    await dbbClient.delete(params)
  } catch (error: any) {
    logger.error('Error get IPNS record: ' + error)
    throw new CustomError(500, 'Internal Server Error.')
  }
}
