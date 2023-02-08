const dbbClient = require('../ddbClient')
const { gatewayTable } = require('../../controller/libs/constants')

const checkSubdomain = async (subDomain) => {
    try {
        const params = {
            TableName: gatewayTable,
            FilterExpression: 'subDomain = :s',
            ExpressionAttributeValues: {
                ':s': subDomain,
            },
        }

        const record = await dbbClient.scan(params).promise()
        const { Items } = record
        return Items[0]
    } catch (error) {
        return null
    }
}

const getRecord = async (publicKey) => {
    try {
        const params = {
            TableName: gatewayTable,
            Key: {
                publicKey: publicKey.toLowerCase(),
            },
        }

        const record = await dbbClient.get(params).promise()
        return record.Item
    } catch (error) {
        return null
    }
}

const updateSubDomain = async (transactionDetails) => {
    try {
        const params = {
            TableName: gatewayTable,
            Item: transactionDetails,
        }

        await dbbClient.put(params).promise()
        return 'Put Successful'
    } catch (error) {
        return null
    }
}

module.exports = {
    checkSubdomain,
    getRecord,
    updateSubDomain,
}
