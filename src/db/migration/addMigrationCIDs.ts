import chalk from 'chalk'
import dbbClient from '../db/ddbClient.js'
import { migrationCIDs } from '../../config/constants.js'
import CustomError from '../../middlewares/error/customError.js'

export default async (record: any) => {
  try {
    const params = {
      TableName: migrationCIDs,
      Item: record,
    }

    const save = await dbbClient.put(params)
    return save
  } catch (error: any) {
    console.log(chalk.yellow('CID save error: ') + chalk.red(error.message))
    throw new CustomError(500, `Internal Server Error.`)
  }
}
