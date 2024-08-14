import dbbClient from '../db/ddbClient.js'
import logger from '../../utils/logger.js'
import { ipnsTable } from '../../config/constants.js'
import CustomError from '../../middlewares/error/customError.js'

export default async (id: string, cid: string): Promise<void> => {
  try {
    const params = {
      TableName: ipnsTable,
      Key: {
        ipnsName: id,
      },
      UpdateExpression: 'set cid = :c, lastUpdate = :u',
      ExpressionAttributeValues: {
        ':c': cid,
        ':u': Date.now(),
      },
    }

    await dbbClient.update(params)
  } catch (error) {
    logger.error('Error get IPNS record: ' + error)
    throw new CustomError(500, 'Internal Server Error.')
  }
}
