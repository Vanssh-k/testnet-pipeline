import dbbClient from '../../db/ddbClient.js'
import CustomError from '../../../middlewares/error/customError.js'
import { LegacyAggregateRecords } from '../../../types/filecoin.js'
import { FilecoinLegacyTables } from '../../../config/constants.js'

export default async (id: string): Promise<LegacyAggregateRecords[]> => {
  try {
    const params = {
      TableName: FilecoinLegacyTables.CAR_BUNDLE_RECORDS,
      Key: {
        aggregateID: id,
      },
    }

    const record = await dbbClient.get(params)
    return record.Item as LegacyAggregateRecords[]
  } catch (error) {
    /* istanbul ignore next */
    throw new CustomError(500, `Internal Server Error.`)
  }
}
