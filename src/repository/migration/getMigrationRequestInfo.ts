import chalk from 'chalk'
import dbbClient from '../ddbClient'
import { migrationRequestTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

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
    console.log(
      chalk.yellow('User Detail Fetch Error: ') + chalk.red(error?.message)
    )
    throw new DatabaseError()
  }
}
