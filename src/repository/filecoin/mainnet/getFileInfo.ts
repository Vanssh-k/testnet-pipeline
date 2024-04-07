import dbbClient from '../../db/ddbClient'
import DatabaseError from '../../../errors/database-error'
import { MainnetTableName } from '../../../controller/libs/constants'

export default async (cid: string) => {
  try {
    const params = {
      TableName: MainnetTableName.FILE_RECORD_TABLE,
      Key: {
        cid: cid,
      },
    }

    const record = await dbbClient.get(params)
    // const record = await dbbClient.query(params)
    return record.Item
  } catch (error) {
    /* istanbul ignore next */
    throw new DatabaseError()
  }
}
