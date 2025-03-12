import dbbClient from '../../db/ddbClient.js'
import logger from '../../../utils/logger.js'

import CustomError from '../../../middlewares/error/customError.js'
import { TestnetAggregateRecord } from '../../../types/filecoin.js'

export default async (id: string): Promise<TestnetAggregateRecord[]> => {
  try {
    const params = {
      TableName: 'testnet-aggregate-records',
      Key: {
        aggregateID: id,
      },
    }

    const record = await dbbClient.get(params)
    return (record.Item as TestnetAggregateRecord[]) ?? []
  } catch (error) {
    logger.error('Error update user details: ' + error)
    throw new CustomError(500, 'Internal Server Error.')
  }
}
