import dbbClient from '../ddbClient'
import { addIPNSRecord } from './types'
import { ipnsTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (record: addIPNSRecord) => {
  try {
    const params = {
      TableName: ipnsTable,
      Item: record,
    }

    await dbbClient.put(params)
    return 'Put Successful'
  } catch (error) {
    throw new DatabaseError()
  }
}
