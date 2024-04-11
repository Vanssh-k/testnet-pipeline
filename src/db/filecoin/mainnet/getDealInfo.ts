import dbbClient from '../../db/ddbClient.js'
import CustomError from '../../../middlewares/error/customError.js'
import { FilecoinDealsMainnet } from '../../../types/filecoin.js'
import { FilecoinMainnetTableName } from '../../../config/constants.js'

export default async (dealId: string): Promise<FilecoinDealsMainnet[]> => {
  try {
    const params = {
      TableName: FilecoinMainnetTableName.DEAL_RECORD_TABLE,
      IndexName: 'chainDealID-index',
      KeyConditionExpression: 'chainDealID = :c',
      ExpressionAttributeValues: {
        ':c': Number(dealId),
      },
    }

    const record = await dbbClient.query(params)
    return record.Items as FilecoinDealsMainnet[]
  } catch (error) {
    /* istanbul ignore next */
    console.error('Error getting deal record', error)
    throw new CustomError(500, `Internal Server Error.`)
  }
}
