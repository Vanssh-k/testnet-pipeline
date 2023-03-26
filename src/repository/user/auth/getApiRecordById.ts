import chalk from 'chalk'
import dbbClient from '../../ddbClient'
import { userAuthTable } from '../../../controller/libs/constants'

export default async (id: string) => {
    try {
        const params = {
            TableName: userAuthTable,
            Key: {
                id: id
            },
        }

        const record = await dbbClient.get(params)
        return record.Item
    } catch (error: any) {
        console.log(
            chalk.yellow('Api Record Fetch Error: ') + chalk.red(error.message)
        )
        return null
    }
}
