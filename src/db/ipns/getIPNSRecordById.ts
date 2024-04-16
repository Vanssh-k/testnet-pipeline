import dbbClient from '../db/ddbClient.js'
import logger from '../../utils/logger.js'
import { IPNSSchema } from '../../types/ipns.js'
import { ipnsTable } from '../../config/constants.js'
import CustomError from '../../middlewares/error/customError.js'

export default async (id: string): Promise<IPNSSchema> => {
  try {
    const params = {
      TableName: ipnsTable,
      Key: {
        ipnsName: id,
      },
    }

    const record = await dbbClient.get(params)
    return record.Item as IPNSSchema
  } catch (error: any) {
    logger.error('Error get IPNS record: ' + error)
    throw new CustomError(500, 'Internal Server Error.')
  }
}
