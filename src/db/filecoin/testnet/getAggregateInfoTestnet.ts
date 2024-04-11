import dbbClient from '../../db/ddbClient.js'
import CustomError from '../../../middlewares/error/customError.js'

import { TestnetTableName } from '../../../config/constants.js'
export default async (id: string) => {
  try {
    const params = {
      TableName: TestnetTableName.AGGREGATE_TABLE,
      IndexName: 'aggregateID-index',
      KeyConditionExpression: 'aggregateID = :c',
      ExpressionAttributeValues: {
        ':c': id,
      },
    }

    const record = await dbbClient.query(params)
    return record.Items ?? []
  } catch (error) {
    /* istanbul ignore next */
    throw new CustomError(500, `Internal Server Error.`)
  }
}
