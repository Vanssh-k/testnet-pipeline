import dbbClient from './db/ddbClient.js'
import { TestnetTableName, MainnetTableName } from './db/tables.js'
import { PODSIRecord } from '../types/dbTypes/inclusionProofTypes.js'
import logger from '../utils/logger.js'
import CustomError from '../middlewares/error/customError.js'

export const getInclusionProof = async (cid: string, network: string): Promise<PODSIRecord | null> => {
  console.log(cid, network)
  try {
    const tableName = network === 'testnet' ? TestnetTableName.PODSI_TABLE : MainnetTableName.PODSI_TABLE

    const params = {
      TableName: tableName,
      Key: {
        cid: cid,
      },
    }

    const record = await dbbClient.get(params)
    return record.Item ? (record.Item as PODSIRecord) : null
  } catch (error) {
    logger.error('Error getting inclusion proof record', error)
    throw new CustomError(500, `Internal Server Error.`)
  }
}
