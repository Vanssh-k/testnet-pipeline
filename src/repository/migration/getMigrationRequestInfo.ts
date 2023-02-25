const chalk  from 'chalk')
const dbbClient  from '../ddbClient')
import {migrationRequestTable }  from '../../controller/libs/constants')
const DatabaseError  from '../../errors/database-error')

export default  async (requestId) => {
    try {
        const params = {
            TableName: migrationRequestTable,
            Key: {
                id: requestId,
            },
        }

        const record = await dbbClient.get(params).promise()
        return record.Item
    } catch (error) {
        console.log(
            chalk.yellow('User Detail Fetch Error: ') + chalk.red(error.message)
        )
        throw new DatabaseError()
    }
}
