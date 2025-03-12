import dbbClient from '../db/ddbClient.js'
import { FilecoinLegacyTables } from '../../config/constants.js'
import { CIDListItem } from '../../types/filecoin.js'

export default async (bundleId: string): Promise<CIDListItem[]> => {
  const params = {
    TableName: FilecoinLegacyTables.FILE_Bundle_Records,
    IndexName: 'bundledIn-index',
    KeyConditionExpression: 'bundledIn = :b',
    ExpressionAttributeValues: {
      ':b': bundleId,
    },
  }

  const record = await dbbClient.query(params)
  return (record.Items as CIDListItem[]) ?? []
}
