import dbbClient from '../db/ddbClient'
import DatabaseError from '../../errors/database-error'
import { filecoinDealRecords } from '../../controller/libs/constants'

export default async (bundleId: string) => {
  try {
    const params = {
      TableName: filecoinDealRecords,
      IndexName: 'bundleId-index',
      KeyConditionExpression: 'bundleId = :b',
      ExpressionAttributeValues: {
        ':b': bundleId,
      },
    }

    const record = await dbbClient.query(params)
    return record.Items ?? []
  } catch (error) {
    /* istanbul ignore next */
    throw new DatabaseError()
  }
}
