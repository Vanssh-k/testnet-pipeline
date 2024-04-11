import dbbClient from '../../db/ddbClient.js'
import CustomError from '../../../middlewares/error/customError.js'

import { TestnetTableName } from '../../../config/constants.js'

export default async (cid: string) => {
  try {
    const params = {
      TableName: TestnetTableName.PODSI_TABLE,
      Key: {
        cid: cid,
      },
    }

    const record = await dbbClient.get(params)
    return record.Item ?? null
  } catch (error) {
    /* istanbul ignore next */
    console.log('Error getting podsi record', error)
    throw new CustomError(500, `Internal Server Error.`)
  }
}
