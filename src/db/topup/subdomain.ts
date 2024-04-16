import { UserDetails } from '../../types/user.js'
import CustomError from '../../middlewares/error/customError.js'
import { gatewayTable } from '../../config/constants.js'
import dbbClient from '../db/ddbClient.js'
import logger from '../../utils/logger.js'

const checkSubdomain = async (name: string) => {
  try {
    const params = {
      TableName: gatewayTable,
      IndexName: 'subDomainName-index',
      KeyConditionExpression: 'subDomainName = :n',
      ExpressionAttributeValues: {
        ':n': name,
      },
    }

    const record = await dbbClient.query(params)
    const items = record.Items ?? []
    return items[0]
  } catch (error) {
    logger.error('Error update user details: ' + error)
    throw new CustomError(500, 'Internal Server Error.')
  }
}

const getRecord = async (publicKey: string) => {
  try {
    const params = {
      TableName: gatewayTable,
      IndexName: 'publicKey-index',
      KeyConditionExpression: 'publicKey = :p',
      ExpressionAttributeValues: {
        ':p': publicKey,
      },
    }

    const record = await dbbClient.query(params)
    return record.Items ?? []
  } catch (error) {
    logger.error('Error update user details: ' + error)
    throw new CustomError(500, 'Internal Server Error.')
  }
}

const updateSubDomain = async (transactionDetails: any) => {
  try {
    const params = {
      TableName: gatewayTable,
      Item: transactionDetails,
    }

    await dbbClient.put(params)
    return 'Put Successful'
  } catch (error) {
    logger.error('Error update user details: ' + error)
    throw new CustomError(500, 'Internal Server Error.')
  }
}

export { checkSubdomain, getRecord, updateSubDomain }
