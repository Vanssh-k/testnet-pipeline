import dbbClient from '../../db/ddbClient.js'
import logger from '../../../utils/logger.js'
import CustomError from '../../../middlewares/error/customError.js'
import { TestnetFilePodsi } from '../../../types/filecoin.js'

export default async (pieceCID: string): Promise<TestnetFilePodsi[]> => {
  try {
    const params = {
      TableName: 'testnet-file-podsi',
      IndexName: 'pieceCID-index',
      KeyConditionExpression: 'pieceCID = :p',
      ExpressionAttributeValues: {
        ':p': pieceCID,
      },
    }

    const record = await dbbClient.query(params)
    return (record.Items as TestnetFilePodsi[]) ?? []
  } catch (error) {
    logger.error('Error update user details: ' + error)
    throw new CustomError(500, 'Internal Server Error.')
  }
}
