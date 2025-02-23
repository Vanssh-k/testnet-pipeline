import dbbClient from '../db/ddbClient.js'
import CustomError from '../../middlewares/error/customError.js'
import { FilecoinLegacyTables } from '../../config/constants.js'
import { FilecoinDealsMainnet } from '../../types/filecoin.js'

export default async (aggregateIn: string): Promise<FilecoinDealsMainnet[]> => {
  try {
    const params = {
      TableName: FilecoinLegacyTables.FILECOIN_DEAL_RECORDS,
      IndexName: 'aggregateIn-index',
      KeyConditionExpression: 'aggregateIn = :a',
      ExpressionAttributeValues: {
        ':a': aggregateIn,
      },
    }

    const record = await dbbClient.query(params)
    return (record.Items as FilecoinDealsMainnet[]) ?? []
  } catch (error) {
    console.log(error)
    /* istanbul ignore next */
    throw new CustomError(500, `Internal Server Error.`)
  }
}
