import dbbClient from '../../db/ddbClient.js'
import CustomError from '../../../middlewares/error/customError.js'
import { FileRecord } from '../../../types/filecoin.js'
import { FilecoinMainnetTableName } from '../../../config/constants.js'

export default async (cid: string): Promise<FileRecord> => {
  try {
    const params = {
      TableName: FilecoinMainnetTableName.FILE_RECORD_TABLE,
      Key: {
        cid: cid,
      },
    }

    const record = await dbbClient.get(params)
    // const record = await dbbClient.query(params)
    return record.Item as FileRecord
  } catch (error) {
    /* istanbul ignore next */
    throw new CustomError(500, `Internal Server Error.`)
  }
}
