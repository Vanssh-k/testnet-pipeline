const dbbClient = require('../ddbClient')
const { gatewayTable } = require('../../controller/libs/constants')

const checkSubdomain = async (name) => {
    try {
        const params = {
            TableName: gatewayTable,
            IndexName: 'subDomainName-index',
            KeyConditionExpression: 'subDomainName = :n',
            ExpressionAttributeValues: {
                ':n': name,
            },
        }

        const record = await dbbClient.query(params).promise()
        return record.Items[0]
    } catch (error) {
        return null
    }
}

const getRecord = async (publicKey) => {
    try {
        const params = {
            TableName: gatewayTable,
            IndexName: 'publicKey-index',
            KeyConditionExpression: 'publicKey = :p',
            ExpressionAttributeValues: {
                ':p': publicKey,
            },
        }

        const record = await dbbClient.query(params).promise()
        return record.Items
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
