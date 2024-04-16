import dbbClient from '../../db/ddbClient.js'
import { V1TestnetTableName, V1MainnetTableName } from '../../../config/constants.js'
import { AggregateRecord } from '../../../types/v1/aggregateTypes.js'
import logger from '../../../utils/logger.js'
import CustomError from '../../../middlewares/error/customError.js'

export const getAggregateInfo = async (id: string, network: string): Promise<AggregateRecord | null> => {
  try {
    const tableName = network === 'testnet' ? V1TestnetTableName.AGGREGATE_TABLE : V1MainnetTableName.AGGREGATE_TABLE

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
