import dbbClient from '../../db/ddbClient.js'
import CustomError from '../../../middlewares/error/customError.js'

import { TestnetTableName } from '../../../config/constants.js'

export default async (dealId: string) => {
  try {
    const params = {
      TableName: TestnetTableName.DEAL_RECORD_TABLE,
      IndexName: 'chainDealID-index',
      KeyConditionExpression: 'chainDealID = :d',
      ExpressionAttributeValues: {
        ':d': Number(dealId),
      },
    }

    const record = await dbbClient.query(params)
    return record.Items ?? []
  } catch (error) {
    /* istanbul ignore next */
    console.error('Error getting deal record', error)
    throw new CustomError(500, `Internal Server Error.`)
  }
}
