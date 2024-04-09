import dbbClient from '../../db/ddbClient'
import DatabaseError from '../../../errors/database-error'
import { TestnetTableName } from '../../../controller/libs/constants'

export default async (cid: string) => {
  try {
    const params = {
      TableName: TestnetTableName.FILE_RECORD_TABLE,
      Key: {
        cid: cid,
      },
    }

    const record = await dbbClient.get(params)
    return record.Item ?? null
  } catch (error) {
    /* istanbul ignore next */
    throw new DatabaseError()
  }
}
