import dbbClient from '../db/ddbClient.js'
import { FilecoinLegacyTables } from '../../config/constants.js'

export default async (bundleId: string) => {
  const params = {
    TableName: FilecoinLegacyTables.FILE_Bundle_Records,
    IndexName: 'bundledIn-index',
    KeyConditionExpression: 'bundledIn = :b',
    ExpressionAttributeValues: {
      ':b': bundleId,
    },
  }

  const record = await dbbClient.query(params)
  return record.Items ?? []
}
