import dbbClient from '../../db/ddbClient.js'
import logger from '../../../utils/logger.js'
import CustomError from '../../../middlewares/error/customError.js'
import { FilecoinDealsMainnet } from '../../../types/filecoin.js'

export default async (aggregateIn: string): Promise<FilecoinDealsMainnet[]> => {
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
    return (record.Items as FilecoinDealsMainnet[]) ?? []
  } catch (error) {
    logger.error('Error update user details: ' + error)
    throw new CustomError(500, 'Internal Server Error.')
  }
}
