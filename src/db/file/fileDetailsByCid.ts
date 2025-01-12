import dbbClient from '../db/ddbClient.js'
import logger from '../../utils/logger.js'
import { FileSchema } from '../../types/file.js'
import { fileTable } from '../../config/constants.js'
import CustomError from '../../middlewares/error/customError.js'

export default async (cid: string): Promise<FileSchema> => {
  try {
    const params = {
      TableName: fileTable,
      IndexName: 'cid-index',
      KeyConditionExpression: 'cid = :c',
      ExpressionAttributeValues: {
        ':c': cid,
      },
    }

    const record = await dbbClient.query(params)
    const Items = record.Items ?? []
    return Items[0] as FileSchema
  } catch (error: any) {
    logger.error('Error get file details by CID: ' + error)
    throw new CustomError(500, `Internal Server Error.`)
  }
}
