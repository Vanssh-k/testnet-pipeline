import dbbClient from '../../db/ddbClient.js'
import logger from '../../../utils/logger.js'
import { PODSI } from '../../../types/filecoin.js'
import CustomError from '../../../middlewares/error/customError.js'
import { FilecoinTestnetTableName } from '../../../config/constants.js'

export default async (cid: string): Promise<PODSI | null> => {
  try {
    const params = {
      TableName: FilecoinTestnetTableName.PODSI_TABLE,
      Key: {
        cid: cid,
      },
    }

    const record = await dbbClient.get(params)
    return (record.Item as PODSI) ?? null
  } catch (error) {
    logger.error('Error update user details: ' + error)
    throw new CustomError(500, 'Internal Server Error.')
  }
}
