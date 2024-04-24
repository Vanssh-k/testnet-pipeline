import dbbClient from '../db/ddbClient.js'
import { MigrationCIDSchema } from '../../types/migration.js'
import { migrationCIDs } from '../../config/constants.js'
import CustomError from '../../middlewares/error/customError.js'

export default async (requestID: string): Promise<MigrationCIDSchema[]> => {
  try {
    const params = {
      TableName: migrationCIDs,
      IndexName: 'requestID-index',
      KeyConditionExpression: 'requestID = :r',
      ExpressionAttributeValues: {
        ':r': requestID,
      },
    }

    const record = await dbbClient.query(params)
    const Items = record.Items ?? []
    return Items as MigrationCIDSchema[]
  } catch (error) {
    throw new CustomError(500, `Internal Server Error.`)
  }
}
