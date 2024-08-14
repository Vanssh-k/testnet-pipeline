import dbbClient from '../../db/ddbClient.js'
import logger from '../../../utils/logger.js'
import CustomError from '../../../middlewares/error/customError.js'

export default async (aggregateIn: string) => {
  try {
    const params = {
      TableName: 'testnet-filecoin-deals',
      IndexName: 'aggregateIn-index',
      KeyConditionExpression: 'aggregateIn = :a',
      ExpressionAttributeValues: {
        ':a': aggregateIn,
      },
    }

    const record = await dbbClient.query(params)
    return record.Items ?? []
  } catch (error) {
    logger.error('Error update user details: ' + error)
    throw new CustomError(500, 'Internal Server Error.')
  }
}
