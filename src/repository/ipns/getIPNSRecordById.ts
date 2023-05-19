import chalk from 'chalk'
import dbbClient from '../db/ddbClient'
import { ipnsTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (id: string) => {
  try {
    const params = {
      TableName: ipnsTable,
      Key: {
        ipnsName: id,
      },
    }

    const record = await dbbClient.get(params)
    return record.Item
  } catch (error: any) {
    console.log(
      chalk.yellow('Api Record Fetch Error: ') + chalk.red(error.message)
    )
    throw new DatabaseError()
  }
}
