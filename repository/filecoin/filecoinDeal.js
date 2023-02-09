const dbbClient = require('../ddbClient')
const filecoinDealRecords = 'filecoin-deal-records'
const DatabaseError = require('../../errors/database-error')

module.exports = async (bundleId) => {
    try {
        const params = {
            TableName: filecoinDealRecords,
            IndexName: 'bundleId-index',
            KeyConditionExpression: 'bundleId = :b',
            ExpressionAttributeValues: {
                ':b': bundleId,
            },
        }

        const record = await dbbClient.query(params).promise()
        const { Items } = record
        return Items
    } catch (error) {
        throw new DatabaseError()
    }
}
