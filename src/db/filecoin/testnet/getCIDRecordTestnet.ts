import dbbClient from '../../db/ddbClient.js'
import logger from '../../../utils/logger.js'
import CustomError from '../../../middlewares/error/customError.js'

export default async (cid: string) => {
  try {
    const params = {
      TableName: 'testnet-file-aggregate-info',
      IndexName: 'cid-index',
      KeyConditionExpression: 'cid = :c',
      ExpressionAttributeValues: {
        ':c': cid,
      },
    }

    const record = await dbbClient.query(params)
    return record.Items ?? []
  } catch (error) {
    logger.error('Error update user details: ' + error)
    throw new CustomError(500, 'Internal Server Error.')
  }
}
