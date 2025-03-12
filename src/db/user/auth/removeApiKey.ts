import dbbClient from '../../db/ddbClient.js'
import logger from '../../../utils/logger.js'
import { UserAuthDetails } from '../../../types/user.js'
import { userAuthTable } from '../../../config/constants.js'
import CustomError from '../../../middlewares/error/customError.js'

export default async (id: string): Promise<boolean> => {
  try {
    const params = {
      TableName: userAuthTable,
      Key: {
        id: id,
      },
    }

    await dbbClient.delete(params)
    return true
  } catch (error: any) {
    logger.error('In removeAPIKey: ' + error)
    throw new CustomError(500, `Internal Server Error.`)
  }
}
