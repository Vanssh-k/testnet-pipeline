import dbbClient from '../db/ddbClient.js'
import CustomError from '../../middlewares/error/customError.js'
import { FilecoinLegacyTables } from '../../config/constants.js'

export default async (pieceCID: string) => {
  try {
    const params = {
      TableName: FilecoinLegacyTables.FILE_POSDI,
      IndexName: 'pieceCID-index',
      KeyConditionExpression: 'pieceCID = :p',
      ExpressionAttributeValues: {
        ':p': pieceCID,
      },
    }

    const record = await dbbClient.query(params)
    return record.Items ?? []
  } catch (error) {
    /* istanbul ignore next */
    throw new CustomError(500, `Internal Server Error.`)
  }
}
