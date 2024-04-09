import dbbClient from '../db/ddbClient'
import DatabaseError from '../../errors/database-error'
import { carBundleRecords } from '../../controller/libs/constants'

export default async (id: string) => {
  try {
    const params = {
      TableName: carBundleRecords,
      Key: {
        aggregateID: id,
      },
    }

    const record = await dbbClient.get(params)
    return record.Item ?? []
  } catch (error) {
    /* istanbul ignore next */
    console.log(error)
    throw new DatabaseError()
  }
}
