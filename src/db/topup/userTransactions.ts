import dbbClient from '../db/ddbClient.js'
import logger from '../../utils/logger.js'
import { userTransactions } from '../../config/constants.js'
import CustomError from '../../middlewares/error/customError.js'

export const getUserTransactions = async (publicKey: string) => {
  try {
    const params = {
      TableName: userTransactions,
      FilterExpression: 'publicKey = :p',
      ExpressionAttributeValues: {
        ':p': publicKey.toLowerCase(),
      },
    }

    const record = await dbbClient.scan(params)
    const Items = record.Items ?? []
    return Items
  } catch (error) {
    logger.error('Error update user details: ' + error)
    throw new CustomError(500, 'Internal Server Error.')
  }
}

export const recordTransactions = async (record: any): Promise<void> => {
  try {
    const params = {
      TableName: userTransactions,
      Item: record,
    }

    await dbbClient.put(params)
  } catch (error) {
    logger.error('Error update user details: ' + error)
    throw new CustomError(500, 'Internal Server Error.')
  }
}
