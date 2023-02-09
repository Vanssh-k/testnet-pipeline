const chalk = require('chalk')
const dbbClient = require('../ddbClient')
const { migrationRequestTable } = require('../../controller/libs/constants')
const DatabaseError = require('../../errors/database-error')

module.exports = async (requestId) => {
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
