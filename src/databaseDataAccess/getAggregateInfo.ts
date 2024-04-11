import dbbClient from './db/ddbClient.js'
import { TestnetTableName, MainnetTableName } from './db/tables.js'
import { AggregateRecord } from '../types/dbTypes/aggregateTypes.js'
import logger from '../utils/logger.js'
import CustomError from '../middlewares/error/customError.js'

export const getAggregateInfo = async (id: string, network: string): Promise<AggregateRecord | null> => {
  try {
    const tableName = network === 'testnet' ? TestnetTableName.AGGREGATE_TABLE : MainnetTableName.AGGREGATE_TABLE

    const params = {
      TableName: tableName,
      Key: {
        aggregateID: id,
      },
    }

    const record = await dbbClient.get(params)
    return record.Item ? (record.Item as AggregateRecord) : null
  } catch (error) {
    logger.error('Error getting aggregate record', error)
    throw new CustomError(500, `Internal Server Error.`)
  }
}
