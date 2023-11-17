import dbbClient from '../../db/ddbClient'
import DatabaseError from '../../../errors/database-error'

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
    throw new DatabaseError()
  }
}
