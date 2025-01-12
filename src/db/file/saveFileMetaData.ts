import dbbClient from '../db/ddbClient.js'
import logger from '../../utils/logger.js'
import { fileTable } from '../../config/constants.js'
import CustomError from '../../middlewares/error/customError.js'

export default async (record: any): Promise<void> => {
  try {
    const params = {
      TableName: fileTable,
      Item: record,
    }

    await dbbClient.put(params)
  } catch (error: any) {
    logger.error('Error save file metadata: ' + error)
    throw new CustomError(500, `Internal Server Error.`)
  }
}
