import dbbClient from '../db/ddbClient.js'
import CustomError from '../../middlewares/error/customError.js'
import { fileBundleRecords } from '../../config/constants.js'

export default async (cid: string) => {
  try {
    const params = {
      TableName: fileBundleRecords,
      IndexName: 'cid-index',
      KeyConditionExpression: 'cid = :c',
      ExpressionAttributeValues: {
        ':c': cid,
      },
    }

    const record = await dbbClient.query(params)
    return record.Items ?? []
  } catch (error) {
    /* istanbul ignore next */
    throw new CustomError(500, `Internal Server Error.`)
  }
}
