import dbbClient from '../db/ddbClient.js'

export default async (cid: string) => {
  const params = {
    TableName: 'ff-cid',
    IndexName: 'cid-index',
    KeyConditionExpression: 'cid = :c',
    ExpressionAttributeValues: {
      ':c': cid,
    },
  }

  const record = await dbbClient.query(params)
  return record.Items ?? []
}
