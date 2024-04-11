import dbbClient from './db/ddbClient.js'
import { TestnetTableName, MainnetTableName } from './db/tables.js'
import { FileList } from '../types/dbTypes/fileInfoTypes.js'
import logger from '../utils/logger.js'
import CustomError from '../middlewares/error/customError.js'

export const getFileInfo = async (cid: string, network: string): Promise<FileList | null> => {
  try {
    const tableName = network === 'testnet' ? TestnetTableName.FILE_RECORD_TABLE : MainnetTableName.FILE_RECORD_TABLE

    const params = {
      TableName: tableName,
      Key: {
        cid: cid,
      },
    }

    const record = await dbbClient.get(params)
    return record.Item ? (record.Item as FileList) : null
  } catch (error) {
    logger.error('Error get file details by CID: ' + error)
    throw new CustomError(500, `Internal Server Error.`)
  }
}
