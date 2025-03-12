import dbbClient from '../db/ddbClient.js'
import { FFCIDRecord } from '../../types/filecoin.js'

export default async (cid: string): Promise<FFCIDRecord[]> => {
  const params = {
    TableName: 'ff-cid',
    IndexName: 'cid-index',
    KeyConditionExpression: 'cid = :c',
    ExpressionAttributeValues: {
      ':c': cid,
    },
  }

  const record = await dbbClient.query(params)
  return (record.Items as FFCIDRecord[]) ?? []
}
