import dbbClient from '../db/ddbClient'
import { endowmentTable } from '../../controller/libs/constants'

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
