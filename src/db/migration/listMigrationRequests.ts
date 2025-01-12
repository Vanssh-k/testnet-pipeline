import dbbClient from '../db/ddbClient.js'
import { migrationRequestTable } from '../../config/constants.js'
import CustomError from '../../middlewares/error/customError.js'
import { MigrationRequestSchema } from '../../types/migration.js'

export default async (publicKey: string): Promise<MigrationRequestSchema[]> => {
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
    return (record.Items as MigrationRequestSchema[]) ?? []
  } catch (error) {
    throw new CustomError(500, `Internal Server Error.`)
  }
}
