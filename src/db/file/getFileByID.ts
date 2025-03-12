import dbbClient from '../db/ddbClient.js'
import logger from '../../utils/logger.js'
import { FileSchema } from '../../types/file.js'
import { fileTable } from '../../config/constants.js'
import CustomError from '../../middlewares/error/customError.js'

export default async (id: string): Promise<FileSchema | undefined> => {
  try {
    const params = {
      TableName: fileTable,
      Key: {
        id: id,
      },
    }

    const record = await dbbClient.get(params)
    return (record.Item as FileSchema) ?? undefined
  } catch (error: any) {
    logger.error('Error get file details by ID: ' + error)
    throw new CustomError(500, `Invalid lastkey.`)
  }
}
