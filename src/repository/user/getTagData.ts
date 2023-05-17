import dbbClient from '../db/ddbClient'
import { cidTagTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (tag: string) => {
  try {
    const params = {
      TableName: cidTagTable,
      Key: {
        tag: tag
      },
    }

    const record = await dbbClient.get(params)
    return record.Item
  } catch (error) {
    console.log(error)
    throw new DatabaseError({})
  }
}
