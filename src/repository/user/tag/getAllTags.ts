import dbbClient from '../../db/ddbClient'
import { cidTagTable } from '../../../controller/libs/constants'

export default async (publicKey: string) => {
  const params = {
    TableName: cidTagTable,
    IndexName: 'publicKey-index',
    KeyConditionExpression: 'publicKey = :p',
    ExpressionAttributeValues: {
      ':p': publicKey,
    },
  }

  const record = await dbbClient.query(params)
  const Items = record.Items?record.Items:[]
  return Items
}
