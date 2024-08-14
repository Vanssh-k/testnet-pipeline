import dbbClient from '../db/ddbClient.js'
import logger from '../../utils/logger.js'
import { IPNSSchema } from '../../types/ipns.js'
import { ipnsTable } from '../../config/constants.js'
import CustomError from '../../middlewares/error/customError.js'

export default async (record: IPNSSchema): Promise<void> => {
  try {
    const params = {
      TableName: ipnsTable,
      Item: record,
    }

    await dbbClient.put(params)
  } catch (error) {
    logger.error('Error create IPNS record: ' + error)
    throw new CustomError(500, 'Internal Server Error.')
  }
}
