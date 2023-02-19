const dbbClient = require('../ddbClient')
const { fileTable } = require('../../controller/libs/constants')
const DatabaseError = require('../../errors/database-error')

module.exports = async (usersPublicKey, pageNo) => {
    try {
        let records = null
        let count = 0
        let exclusiveStartKey = null
        if (pageNo < 1) {
            throw new DatabaseError()
        }
        do {
            const params = {
                TableName: fileTable,
                IndexName: 'publicKey-createdAt-index',
                ScanIndexForward: false,
                KeyConditionExpression: 'publicKey = :p',
                ExpressionAttributeValues: {
                    ':p': usersPublicKey,
                },
                Limit: 20000,
                ExclusiveStartKey: exclusiveStartKey,
            }

            records = await dbbClient.query(params).promise()
            count += 1
            exclusiveStartKey = records.LastEvaluatedKey
            if (!exclusiveStartKey && pageNo > count) {
                records = {
                    Items: [],
                }
                break
            }
        } while (count !== parseInt(pageNo))

        const { Items } = records
        return Items
    } catch (error) {
        throw new DatabaseError()
    }
}
