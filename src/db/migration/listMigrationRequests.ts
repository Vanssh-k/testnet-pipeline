import dbbClient from '../db/ddbClient.js'
import { migrationRequestTable } from '../../config/constants.js'
import CustomError from '../../middlewares/error/customError.js'

export default async (publicKey: string) => {
  try {
    const params = {
      TableName: migrationRequestTable,
      IndexName: 'publicKey-index',
      KeyConditionExpression: 'publicKey = :p',
      ExpressionAttributeValues: {
        ':p': publicKey,
      },
    }

    const record = await dbbClient.query(params)
    const Items = record.Items ?? []
    return Items
  } catch (error) {
    throw new CustomError(500, `Internal Server Error.`)
  }
}
