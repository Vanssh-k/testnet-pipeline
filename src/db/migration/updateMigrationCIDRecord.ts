import dbbClient from '../db/ddbClient.js'
import { migrationCIDs } from '../../config/constants.js'
import CustomError from '../../middlewares/error/customError.js'

export default async (id: string, data: any) => {
  try {
    const params = {
      TableName: migrationCIDs,
      Key: {
        id,
      },
      UpdateExpression: 'set userDataUpdated = :u',
      ExpressionAttributeValues: {
        ':u': data,
      },
    }

    await dbbClient.update(params)
    return 'Update Successful'
  } catch (error) {
    throw new CustomError(500, `Internal Server Error.`)
  }
}
