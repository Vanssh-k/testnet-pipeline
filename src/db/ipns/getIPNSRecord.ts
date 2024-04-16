import dbbClient from '../db/ddbClient.js'
import logger from '../../utils/logger.js'
import { IPNSSchema } from '../../types/ipns.js'
import { ipnsTable } from '../../config/constants.js'
import CustomError from '../../middlewares/error/customError.js'

export default async (publicKey: string): Promise<IPNSSchema[]> => {
  try {
    const params = {
      TableName: ipnsTable,
      IndexName: 'publicKey-index',
      KeyConditionExpression: 'publicKey = :p',
      ExpressionAttributeValues: {
        ':p': publicKey,
      },
    }

    const records = await dbbClient.query(params)
    const Items = records.Items ? records.Items : []
    return Items as IPNSSchema[]
  } catch (error) {
    logger.error('Error get IPNS record: ' + error)
    throw new CustomError(500, 'Internal Server Error.')
  }
}
