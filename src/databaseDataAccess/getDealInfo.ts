import dbbClient from './db/ddbClient.js'
import { TestnetTableName, MainnetTableName } from './db/tables.js'
import { DealRecordInterface } from '../types/dbTypes/dealTypes.js'
import logger from '../utils/logger.js'
import CustomError from '../middlewares/error/customError.js'

export const getDealInfo = async (dealId: string, network: string): Promise<DealRecordInterface | null> => {
  try {
    const tableName = network === 'testnet' ? TestnetTableName.DEAL_RECORD_TABLE : MainnetTableName.DEAL_RECORD_TABLE

    const params = {
      TableName: tableName,
      IndexName: 'chainDealID-index',
      KeyConditionExpression: 'chainDealID = :d',
      ExpressionAttributeValues: {
        ':d': Number(dealId),
      },
    }

    const record = await dbbClient.query(params)
    return record.Items ? (record.Items[0] as DealRecordInterface) : null
  } catch (error) {
    logger.error('Error getting deal record', error)
    throw new CustomError(500, `Internal Server Error.`)
  }
}
