import docClient from '../../../db/db/ddbClient.js'
import { ffTransactions } from '../../../config/constants.js'

const getTransactions = async (evalKey: any) => {
  const limit = 10

  const params: any = {
    TableName: ffTransactions,
    IndexName: 'purchase-createdAt-index',
    KeyConditionExpression: '#purchase = :purchaseVal',
    ExpressionAttributeNames: {
      '#purchase': 'purchase',
    },
    ExpressionAttributeValues: {
      ':purchaseVal': 'yes',
    },
    ScanIndexForward: false,
    Limit: limit,
  }

  if (evalKey) {
    params.ExclusiveStartKey = JSON.parse(evalKey as string)
  }

  try {
    const data = await docClient.query(params)
    return { items: data.Items, lastEvaluatedKey: data.LastEvaluatedKey }
  } catch (error: any) {
    console.error(error)
    throw new Error()
  }
}

export { getTransactions }
