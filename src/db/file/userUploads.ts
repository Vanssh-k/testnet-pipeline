import dbbClient from '../db/ddbClient.js'
import logger from '../../utils/logger.js'
import { FileSchema } from '../../types/file.js'
import { fileTable } from '../../config/constants.js'
import { filesPageSize } from '../../config/constants.js'
import CustomError from '../../middlewares/error/customError.js'

export default async (usersPublicKey: string, exclusiveStartKey: any): Promise<FileSchema[]> => {
  try {
    const params = {
      TableName: fileTable,
      IndexName: 'publicKey-createdAt-index',
      KeyConditionExpression: 'publicKey = :p',
      ExpressionAttributeValues: {
        ':p': usersPublicKey,
      },
      ScanIndexForward: false,
      Limit: filesPageSize,
      ExclusiveStartKey: exclusiveStartKey,
    }

    const record = await dbbClient.query(params)
    return (record.Items as FileSchema[]) ?? []
  } catch (error: any) {
    logger.error(`Error in listing collection: ${error}`)
    throw new CustomError(500, `Internal Server Error.`)
  }
}
