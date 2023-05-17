import chalk from 'chalk'
import dbbClient from '../db/ddbClient'
import { cidTagTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (id: string) => {
  try {
    const params = {
      TableName: cidTagTable,
      Key: {
        id: id,
      },
    }

    const status = await dbbClient.delete(params)
    return status
  } catch (error: any) {
    console.log(chalk.yellow('Delete IPNS Key Error: ') + error.message)
    throw new DatabaseError()
  }
}
