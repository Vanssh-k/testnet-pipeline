import dbbClient from '../../db/ddbClient.js'
import logger from '../../../utils/logger.js'
import CustomError from '../../../middlewares/error/customError.js'
import { TestnetDealRecords } from '../../../types/filecoin.js'
import { FilecoinTestnetTableName } from '../../../config/constants.js'

export default async (dealId: string): Promise<TestnetDealRecords[]> => {
  try {
    const params = {
      TableName: FilecoinTestnetTableName.DEAL_RECORD_TABLE,
      IndexName: 'chainDealID-index',
      KeyConditionExpression: 'chainDealID = :d',
      ExpressionAttributeValues: {
        ':d': Number(dealId),
      },
    }

    const record = await dbbClient.query(params)
    return record.Items as TestnetDealRecords[]
  } catch (error) {
    logger.error('Error update user details: ' + error)
    throw new CustomError(500, 'Internal Server Error.')
  }
}
