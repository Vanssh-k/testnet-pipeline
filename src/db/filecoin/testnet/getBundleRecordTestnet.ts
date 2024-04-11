import dbbClient from '../../db/ddbClient.js'
import CustomError from '../../../middlewares/error/customError.js'

export default async (id: string) => {
  try {
    const params = {
      TableName: 'testnet-aggregate-records',
      Key: {
        aggregateID: id,
      },
    }

    const record = await dbbClient.get(params)
    return record.Item ?? []
  } catch (error) {
    /* istanbul ignore next */
    console.log(error)
    throw new CustomError(500, `Internal Server Error.`)
  }
}
