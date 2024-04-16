import dbbClient from '../../db/ddbClient.js'
import logger from '../../../utils/logger.js'
import CustomError from '../../../middlewares/error/customError.js'

import { FilecoinTestnetTableName } from '../../../config/constants.js'
export default async (id: string) => {
  try {
    const params = {
      TableName: FilecoinTestnetTableName.AGGREGATE_TABLE,
      IndexName: 'aggregateID-index',
      KeyConditionExpression: 'aggregateID = :c',
      ExpressionAttributeValues: {
        ':c': id,
      },
    }

    const record = await dbbClient.query(params)
    return record.Items ?? []
  } catch (error) {
    logger.error('Error update user details: ' + error)
    throw new CustomError(500, 'Internal Server Error.')
  }
}
