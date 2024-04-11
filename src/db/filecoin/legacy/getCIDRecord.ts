import dbbClient from '../../db/ddbClient.js'
import CustomError from '../../../middlewares/error/customError.js'
import { LegacyFileAggregateInfo } from '../../../types/filecoin.js'
import { FilecoinLegacyTables } from '../../../config/constants.js'

export default async (cid: string): Promise<LegacyFileAggregateInfo[]> => {
  try {
    const params = {
      TableName: FilecoinLegacyTables.FILE_Bundle_Records,
      IndexName: 'cid-index',
      KeyConditionExpression: 'cid = :c',
      ExpressionAttributeValues: {
        ':c': cid,
      },
    }

    const record = await dbbClient.query(params)
    return record.Items as LegacyFileAggregateInfo[]
  } catch (error) {
    /* istanbul ignore next */
    throw new CustomError(500, `Internal Server Error.`)
  }
}
