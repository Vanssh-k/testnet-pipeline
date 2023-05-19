import dbbClient from '../db/ddbClient'
import { gatewayTable } from '../../controller/libs/constants'

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
    return null
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
    return []
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
    return null
  }
}

export { checkSubdomain, getRecord, updateSubDomain }
