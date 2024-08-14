import dbbClient from '../../db/ddbClient.js'
import logger from '../../../utils/logger.js'
import { cidTagTable } from '../../../config/constants.js'
import CustomError from '../../../middlewares/error/customError.js'

export default async (id: string): Promise<void> => {
  try {
    const params = {
      TableName: cidTagTable,
      Key: {
        id: id,
      },
    }
    await dbbClient.delete(params)
  } catch (error) {
    logger.error('In checkAPIKey: ' + error)
    throw new CustomError(500, `Internal Server Error.`)
  }
}
