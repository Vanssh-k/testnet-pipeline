import dbbClient from '../../db/ddbClient.js'
import logger from '../../../utils/logger.js'
import CustomError from '../../../middlewares/error/customError.js'
import { DealParameters } from '../../../types/filecoin.js'

export default async (dealParams: DealParameters) => {
  try {
    const params = {
      TableName: 'deal-parameters',
      Item: dealParams,
    }

    await dbbClient.put(params)
  } catch (error) {
    logger.error('Error update user details: ' + error)
    throw new CustomError(500, 'Internal Server Error.')
  }
}
