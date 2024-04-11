import dbbClient from './db/ddbClient.js'
import { TestnetTableName, MainnetTableName } from './db/tables.js'
import { RAASJobs } from '../types/dbTypes/raasTypes.js'
import logger from '../utils/logger.js'
import CustomError from '../middlewares/error/customError.js'

export const getRaasInfo = async (cid: string, network: string): Promise<RAASJobs | null> => {
  try {
    const tableName = network === 'testnet' ? TestnetTableName.RAAS_TABLE : MainnetTableName.RAAS_TABLE

    const params = {
      TableName: tableName,
      Key: {
        cid: cid,
      },
    }

    const record = await dbbClient.get(params)
    return record.Item ? (record.Item as RAASJobs) : null
  } catch (error) {
    logger.error('Error getting raas record', error)
    throw new CustomError(500, `Internal Server Error.`)
  }
}
