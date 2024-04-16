import dbbClient from '../db/ddbClient.js'
import { endowmentTable } from '../../config/constants.js'

export const getEndowmentTransactions = async () => {
  try {
    const params = {
      TableName: endowmentTable,
    }

    const record = await dbbClient.scan(params)
    const Items = record.Items ?? []
    return Items
  } catch (error) {
    return null
  }
}
