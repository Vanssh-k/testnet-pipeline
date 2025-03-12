import dbbClient from '../db/ddbClient.js'
import { cidDealsTable } from '../../config/constants.js'
import CustomError from '../../middlewares/error/customError.js'

type dealInfo = {
  dealId: number
  endEpoch: number
  provider: string
}

type DealSchema = {
  cid: string
  path: string
  pieceCID: string
  dealInfo: dealInfo[]
}

export default async (cid: string): Promise<DealSchema> => {
  try {
    const params = {
      TableName: cidDealsTable,
      Key: {
        cid: cid,
      },
    }

    const record = await dbbClient.get(params)
    return record.Item as DealSchema
  } catch (e) {
    /* istanbul ignore next */
    throw new CustomError(500, 'Internal Server Error.')
  }
}
