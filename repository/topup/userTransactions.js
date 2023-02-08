const dbbClient = require('../ddbClient')
const {
    subscriptionPurchaseTransactions,
} = require('../../controller/libs/constants')

exports.userTransactions = async (publicKey) => {
    try {
        const params = {
            TableName: subscriptionPurchaseTransactions,
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
