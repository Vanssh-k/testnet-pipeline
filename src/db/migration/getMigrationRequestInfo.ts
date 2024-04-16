import dbbClient from '../db/ddbClient.js'
import { MigrationRequestSchema } from '../../types/migration.js'
import { migrationRequestTable } from '../../config/constants.js'
import CustomError from '../../middlewares/error/customError.js'

export default async (requestId: string): Promise<MigrationRequestSchema> => {
  try {
    const params = {
      TableName: migrationRequestTable,
      Key: {
        id: requestId,
      },
    }

    const record = await dbbClient.get(params)
    return record.Item as MigrationRequestSchema
  } catch (error: any) {
    throw new CustomError(500, `Internal Server Error.`)
  }
}
