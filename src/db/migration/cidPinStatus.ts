import dbbClient from '../db/ddbClient.js'
import { migrationCIDs } from '../../config/constants.js'
import CustomError from '../../middlewares/error/customError.js'
import { MigrationCIDSchema } from '../../types/migration.js'

export default async (cid: string): Promise<MigrationCIDSchema[]> => {
  try {
    const params = {
      TableName: migrationCIDs,
      IndexName: 'cid-index',
      KeyConditionExpression: 'cid = :c',
      ExpressionAttributeValues: {
        ':c': cid,
      },
    }

    const record = await dbbClient.query(params)
    return (record.Items as MigrationCIDSchema[]) ?? []
  } catch (error) {
    console.log(error)
    throw new CustomError(500, `Internal Server Error.`)
  }
}
