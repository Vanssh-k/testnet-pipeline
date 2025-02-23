import docClient from '../../../db/db/ddbClient.js'
import { ffTransactions } from '../../../config/constants.js'
import { FFTransaction } from '../../../types/filecoin.js'

interface TransactionsResult {
  items: FFTransaction[]
  lastEvaluatedKey?: any
}

const getTransactions = async (evalKey: string | null): Promise<TransactionsResult> => {
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
    return { items: data.Items as FFTransaction[], lastEvaluatedKey: data.LastEvaluatedKey }
  } catch (error: any) {
    console.error(error)
    throw new Error()
  }
}

const getUserTransactions = async (evalKey: string | null, userAddress: string): Promise<TransactionsResult> => {
  const limit = 10

  // Build the query parameters
  const params: any = {
    TableName: ffTransactions,
    IndexName: 'purchase-createdAt-index', // Use the GSI
    KeyConditionExpression: '#purchase = :purchaseVal',
    FilterExpression: '#from = :userAddress',
    ExpressionAttributeNames: {
      '#purchase': 'purchase',
      '#from': 'from',
    },
    ExpressionAttributeValues: {
      ':purchaseVal': 'yes',
      ':userAddress': userAddress,
    },
    ScanIndexForward: false, // Descending order by createdAt
    Limit: limit,
  }

  if (evalKey) {
    params.ExclusiveStartKey = JSON.parse(evalKey as string)
  }

  try {
    const data = await docClient.query(params)
    return { items: data.Items as FFTransaction[], lastEvaluatedKey: data.LastEvaluatedKey }
  } catch (error: any) {
    console.error(error)
    throw new Error()
  }
}

export { getTransactions, getUserTransactions }
