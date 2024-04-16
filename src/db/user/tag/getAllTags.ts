import dbbClient from '../../db/ddbClient.js'
import logger from '../../../utils/logger.js'
import { TagDetails } from '../../../types/tag.js'
import { cidTagTable } from '../../../config/constants.js'
import CustomError from '../../../middlewares/error/customError.js'

export default async (publicKey: string): Promise<TagDetails[]> => {
  try {
    const params = {
      TableName: cidTagTable,
      IndexName: 'publicKey-index',
      KeyConditionExpression: 'publicKey = :p',
      ExpressionAttributeValues: {
        ':p': publicKey,
      },
    }

    const record = await dbbClient.query(params)
    const Items = record.Items ? record.Items : []
    return Items as TagDetails[]
  } catch (error) {
    logger.error('In checkAPIKey: ' + error)
    throw new CustomError(500, `Internal Server Error.`)
  }
}
