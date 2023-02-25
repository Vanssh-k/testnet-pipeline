const chalk  from 'chalk')
const dbbClient  from '../ddbClient')
import {migrationCIDs }  from '../../controller/libs/constants')
const DatabaseError  from '../../errors/database-error')

export default  async (record) => {
    try {
        const params = {
            TableName: migrationCIDs,
            Item: record,
        }

        const save = await dbbClient.put(params).promise()
        return save
    } catch (error) {
        console.log(chalk.yellow('CID save error: ') + chalk.red(error.message))
        throw new DatabaseError()
    }
}
