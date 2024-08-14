import dbbClient from '../../db/ddbClient.js'
import logger from '../../../utils/logger.js'
import CustomError from '../../../middlewares/error/customError.js'
import { RAASTesting } from '../../../types/filecoin.js'
import { FilecoinTestnetTableName } from '../../../config/constants.js'

export default async (cid: string): Promise<RAASTesting> => {
  try {
    const params = {
      TableName: FilecoinTestnetTableName.RAAS_TABLE,
      Key: {
        cid: cid,
      },
    }

    const record = await dbbClient.get(params)
    return record.Item as RAASTesting
  } catch (error) {
    logger.error('Error update user details: ' + error)
    throw new CustomError(500, 'Internal Server Error.')
  }
}
