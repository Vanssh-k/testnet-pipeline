import dbbClient from '../../db/ddbClient.js'
import CustomError from '../../../middlewares/error/customError.js'

import { MainnetTableName } from '../../../config/constants.js'

export default async (cid: string) => {
  try {
    const params = {
      TableName: MainnetTableName.PODSI_TABLE,
      Key: {
        cid: cid,
      },
    }
    const record = await dbbClient.get(params)
    // const record = await dbbClient.query(params)
    return record.Item
  } catch (error) {
    /* istanbul ignore next */
    console.log('Error getting podsi record', error)
    throw new CustomError(500, `Internal Server Error.`)
  }
}
