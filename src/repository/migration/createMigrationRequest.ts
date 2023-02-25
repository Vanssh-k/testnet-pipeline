const chalk  from 'chalk')
const dbbClient  from '../ddbClient')
import {migrationRequestTable }  from '../../controller/libs/constants')
const DatabaseError  from '../../errors/database-error')

export default  async (record) => {
    try {
        const params = {
            TableName: migrationRequestTable,
            Item: record,
        }

        const save = await dbbClient.put(params).promise()
        return save
    } catch (error) {
        console.log(
            chalk.yellow('Order save error: ') + chalk.red(error.message)
        )
        throw new DatabaseError()
    }
}
