import dbbClient from '../../db/ddbClient.js'
import logger from '../../../utils/logger.js'
import { TagDetails } from '../../../types/tag.js'
import { cidTagTable } from '../../../config/constants.js'
import CustomError from '../../../middlewares/error/customError.js'

export default async (id: string): Promise<TagDetails> => {
  try {
    const params = {
      TableName: cidTagTable,
      Key: {
        id: id,
      },
    }

    const record = await dbbClient.get(params)
    return record.Item as TagDetails
  } catch (error) {
    logger.error('In checkAPIKey: ' + error)
    throw new CustomError(500, `Internal Server Error.`)
  }
}
