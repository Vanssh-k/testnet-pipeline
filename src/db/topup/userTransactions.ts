import dbbClient from '../db/ddbClient.js'
import logger from '../../utils/logger.js'
import { userTransactions } from '../../config/constants.js'
import CustomError from '../../middlewares/error/customError.js'
import { UserTransaction } from '../../types/transaction.js'

export const getUserTransactions = async (publicKey: string): Promise<UserTransaction[]> => {
  try {
    const params = {
      TableName: userTransactions,
      IndexName: 'publicKey-createdAt-index',
      KeyConditionExpression: 'publicKey = :p',
      ExpressionAttributeValues: {
        ':p': publicKey,
      },
    }

    const record = await dbbClient.query(params)
    return (record.Items as UserTransaction[]) ?? []
  } catch (error) {
    logger.error('Error getting user transactions: ' + error)
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
    logger.error('Error recording user transaction: ' + error)
    throw new CustomError(500, 'Internal Server Error.')
  }
}
