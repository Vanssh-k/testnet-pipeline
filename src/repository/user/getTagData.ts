import dbbClient from '../db/ddbClient'
import { cidTagTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (tag: string) => {
  try {
    const params = {
      TableName: cidTagTable,
      IndexName: 'tag-index',
      KeyConditionExpression: 'tag = :p',
      ExpressionAttributeValues: {
        ':p': tag,
      },
    }

    const record = await dbbClient.query(params)
    const Items = record.Items?record.Items:[]
    return Items
  } catch (error) {
    console.log(error)
    throw new DatabaseError({})
  }
}
