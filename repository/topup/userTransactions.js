const dbbClient = require('../ddbClient')
const { userTransactions } = require('../../controller/libs/constants')

exports.getUserTransactions = async (publicKey) => {
    try {
        const params = {
            TableName: userTransactions,
            FilterExpression: 'publicKey = :p',
            ExpressionAttributeValues: {
                ':p': publicKey.toLowerCase(),
            },
        }

        const record = await dbbClient.scan(params).promise()
        const { Items } = record
        return Items
    } catch (error) {
        return null
    }
}

exports.recordTransactions = async (record) => {
    try {
        const params = {
            TableName: userTransactions,
            Item: record,
        }

        const _ = await dbbClient.put(params).promise()
        return Items
    } catch (error) {
        return null
    }
}
