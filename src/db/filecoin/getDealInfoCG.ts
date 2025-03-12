import { FFDeal } from '../../types/filecoin.js'
import dbbClient from '../db/ddbClient.js'
import CustomError from '../../middlewares/error/customError.js'

export default async (pieceCID: string): Promise<FFDeal> => {
  try {
    const params = {
      TableName: 'ff-deals',
      Key: {
        pieceCID: pieceCID,
      },
    }

    const record = await dbbClient.get(params)
    return record.Item as FFDeal
  } catch (e) {
    /* istanbul ignore next */
    throw new CustomError(500, 'Internal Server Error.')
  }
}
