import dbbClient from '../db/ddbClient'
import { cidTagTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (id: string) => {
  try {
    const params = {
      TableName: cidTagTable,
      Key: {
        id: id,
      },
    }

    const record = await dbbClient.get(params)
    return record.Item
  } catch (error) {
    console.log(error)
    throw new DatabaseError({})
  }
}
