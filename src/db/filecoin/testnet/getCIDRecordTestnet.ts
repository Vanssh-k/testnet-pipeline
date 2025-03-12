import dbbClient from '../../db/ddbClient.js'
import logger from '../../../utils/logger.js'
import CustomError from '../../../middlewares/error/customError.js'
import { TestnetFileAggregateInfo } from '../../../types/filecoin.js'

export default async (cid: string): Promise<TestnetFileAggregateInfo[]> => {
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
    return (record.Items as TestnetFileAggregateInfo[]) ?? []
  } catch (error) {
    logger.error('Error update user details: ' + error)
    throw new CustomError(500, 'Internal Server Error.')
  }
}
