import chalk from 'chalk'
import dbbClient from '../ddbClient'
import { migrationRequestTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (record: any) => {
    try {
        const params = {
            TableName: migrationRequestTable,
            Item: record,
        }

        const save = await dbbClient.put(params)
        return save
    } catch (error: any) {
        console.log(
            chalk.yellow('Order save error: ') + chalk.red(error.message)
        )
        throw new DatabaseError()
    }
}
