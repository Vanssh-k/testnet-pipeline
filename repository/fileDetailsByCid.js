const dbbClient = require('./ddbClient')
const { fileTable } = require('../controller/libs/constants')

module.exports = async (cid) => {
    try {
        const params = {
            TableName: fileTable,
            IndexName: 'cid-index',
            KeyConditionExpression: 'cid = :c',
            ExpressionAttributeValues: {
                ':c': cid,
            },
        }

        const record = await dbbClient.query(params).promise()
        const { Items } = record
        return Items[0]
    } catch (error) {
        return null
    }
}
