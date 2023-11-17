import dbbClient from '../db/ddbClient'
import { ipnsTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (id: string) => {
  try {
    const params = {
      TableName: ipnsTable,
      Key: {
        ipnsName: id,
      },
    }

    const record = await dbbClient.get(params)
    return record.Item
  } catch (error: any) {
    throw new DatabaseError()
  }
}
