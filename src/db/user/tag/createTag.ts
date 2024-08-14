import dbbClient from '../../db/ddbClient.js'
import logger from '../../../utils/logger.js'
import { TagDetails } from '../../../types/tag.js'
import { cidTagTable } from '../../../config/constants.js'
import CustomError from '../../../middlewares/error/customError.js'

export default async (tagDetails: TagDetails): Promise<void> => {
  try {
    const params = {
      TableName: cidTagTable,
      Item: tagDetails,
    }
    await dbbClient.put(params)
  } catch (error) {
    logger.error('In checkAPIKey: ' + error)
    throw new CustomError(500, `Internal Server Error.`)
  }
}
