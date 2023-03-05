import chalk from 'chalk'
import dbbClient from '../ddbClient'
import { migrationCIDs } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

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
        throw new DatabaseError()
    }
}
