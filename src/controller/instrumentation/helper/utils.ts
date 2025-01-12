import axios from 'axios'
import { Select } from '@aws-sdk/client-dynamodb'
import docClient from '../../../db/db/ddbClient.js'
import { ffTransactions, ffUserRecord, historicRecords } from '../../../config/constants.js'
import { HistoricDataKey, HistoricRecord } from '../../../types/filecoin.js'

export const getExchangeRate = async (): Promise<number> => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=filecoin&vs_currencies=usd')
    return response.data.filecoin.usd
  } catch (error) {
    console.error('Error fetching exchange rate:', error)
    throw error
  }
}

export const get24hVolume = async (): Promise<number> => {
  const now = Date.now()
  const oneDayAgo = Math.floor(now / 1000) - 24 * 3600

  const params = {
    TableName: ffTransactions,
    IndexName: 'purchase-createdAt-index',
    KeyConditionExpression: '#purchase = :purchaseValue AND #createdAt >= :oneDayAgo',
    ExpressionAttributeNames: {
      '#purchase': 'purchase',
      '#createdAt': 'createdAt',
    },
    ExpressionAttributeValues: {
      ':purchaseValue': 'yes',
      ':oneDayAgo': oneDayAgo,
    },
  }

  try {
    const data = await docClient.query(params)
    const transactions = data.Items || []

    const totalVolume = transactions.reduce((sum, transaction) => sum + transaction.amount, 0)
    return totalVolume
  } catch (err) {
    console.error('Error getting transactions:', err)
    throw err
  }
}

export const getDepositerCount = async (): Promise<number> => {
  const params: any = {
    TableName: ffUserRecord,
    Select: Select.COUNT, // Use the Select enum
  }

  let totalCount = 0
  let lastEvaluatedKey = null

  try {
    do {
      const data = await docClient.scan(params)
      totalCount += data.Count || 0
      lastEvaluatedKey = data.LastEvaluatedKey
      params.ExclusiveStartKey = lastEvaluatedKey
    } while (lastEvaluatedKey)

    return totalCount
  } catch (error) {
    console.error('Error getting depositors count:', error)
    throw error
  }
}

export const fetchData = async (attribute: HistoricDataKey): Promise<number[]> => {
  const params = {
    TableName: historicRecords,
    KeyConditionExpression: 'recordType = :recordType',
    ExpressionAttributeValues: {
      ':recordType': 'daily',
    },
    ProjectionExpression: `recordDate, ${attribute}`,
    ScanIndexForward: false,
  }

  try {
    const data = await docClient.query(params)
    const items = data.Items as HistoricRecord[]
    return items?.map((item) => item[attribute]) ?? []
  } catch (error) {
    console.error(`Error fetching ${attribute} data:`, error)
    throw error
  }
}
