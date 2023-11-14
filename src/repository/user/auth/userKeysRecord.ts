import dbbClient from '../../db/ddbClient'
import { userAuthTable } from '../../../controller/libs/constants'
import logger from '../../../utils/logger'

export default async (publicKey: string) => {
  try {
    const params = {
      TableName: userAuthTable,
      IndexName: 'publicKey-index',
      KeyConditionExpression: 'publicKey = :p',
      ExpressionAttributeValues: {
        ':p': publicKey,
      },
    }

    const record = await dbbClient.query(params)
    const Items = record.Items ?? []
    return Items
  } catch (error: any) {
    const myLogger = logger('error', 'authentication')
    myLogger.error('Error fetch user keys: ' + error.message)
    return false
  }
}
