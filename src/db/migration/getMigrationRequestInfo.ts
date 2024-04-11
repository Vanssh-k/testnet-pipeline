import chalk from 'chalk'
import dbbClient from '../db/ddbClient.js'
import { migrationRequestTable } from '../../config/constants.js'
import CustomError from '../../middlewares/error/customError.js'

export default async (requestId: string) => {
  try {
    const params = {
      TableName: migrationRequestTable,
      Key: {
        id: requestId,
      },
    }

    const record = await dbbClient.get(params)
    return record.Item
  } catch (error: any) {
    console.log(chalk.yellow('User Detail Fetch Error: ') + chalk.red(error?.message))
    throw new CustomError(500, `Internal Server Error.`)
  }
}
