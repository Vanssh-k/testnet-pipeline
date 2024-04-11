import dbbClient from '../../db/ddbClient.js'
import CustomError from '../../../middlewares/error/customError.js'

export default async (aggregateIn: string) => {
  try {
    const params = {
      TableName: 'testnet-filecoin-deals',
      IndexName: 'aggregateIn-index',
      KeyConditionExpression: 'aggregateIn = :a',
      ExpressionAttributeValues: {
        ':a': aggregateIn,
      },
    }

    const record = await dbbClient.query(params)
    return record.Items ?? []
  } catch (error) {
    console.log(error)
    /* istanbul ignore next */
    throw new CustomError(500, `Internal Server Error.`)
  }
}
