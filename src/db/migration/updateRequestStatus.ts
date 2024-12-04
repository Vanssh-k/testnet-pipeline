import dbbClient from '../db/ddbClient.js'
import { migrationRequestTable } from '../../config/constants.js'
import CustomError from '../../middlewares/error/customError.js'

export default async (id: string, status: string) => {
  try {
    const params = {
      TableName: migrationRequestTable,
      Key: {
        id,
      },
      UpdateExpression: 'set migrationStatus = :u',
      ExpressionAttributeValues: {
        ':u': status,
      },
    }

    await dbbClient.update(params)
    return 'Update Successful'
  } catch (error) {
    throw new CustomError(500, `Internal Server Error.`)
  }
}
