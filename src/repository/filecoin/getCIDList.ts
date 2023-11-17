import dbbClient from '../db/ddbClient'
import { fileBundleRecords } from '../../controller/libs/constants'

export default async (bundleId: string) => {
  const params = {
    TableName: fileBundleRecords,
    IndexName: 'bundledIn-index',
    KeyConditionExpression: 'bundledIn = :b',
    ExpressionAttributeValues: {
      ':b': bundleId,
    },
  }

  const record = await dbbClient.query(params)
  return record.Items ?? []
}
