import chalk from 'chalk'
import dbbClient from '../db/ddbClient'
import { ipnsTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (key: string) => {
  try {
    const params = {
      TableName: ipnsTable,
      Key: {
        ipnsName: key,
      },
    }

    const status = await dbbClient.delete(params)
    return status
  } catch (error: any) {
    console.log(chalk.yellow('Delete IPNS Key Error: ') + error.message)
    throw new DatabaseError()
  }
}
