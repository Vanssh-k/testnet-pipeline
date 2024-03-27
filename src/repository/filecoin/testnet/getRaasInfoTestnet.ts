import dbbClient from '../../db/ddbClient'
import DatabaseError from '../../../errors/database-error'
import { TestnetTableName } from '../../../controller/libs/constants'
export default async (cid: string) => {
  try {
    const params = {
      TableName: TestnetTableName.RAAS_TABLE,
      Key: {
        aggregateID: cid,
      },
    }

    const record = await dbbClient.get(params)
    return record.Item
  } catch (error) {
    /* istanbul ignore next */
    console.log('Error getting raas record', error)
    throw new DatabaseError()
  }
}
