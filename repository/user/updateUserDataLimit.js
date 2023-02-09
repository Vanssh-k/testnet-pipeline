const dbbClient = require('../ddbClient')
const { userTable } = require('../../controller/libs/constants')
const DatabaseError = require('../../errors/database-error')

module.exports = async (publicKey, dataLimit) => {
    try {
        const params = {
            TableName: userTable,
            Key: {
                publicKey,
            },
            UpdateExpression: 'set dataLimit = :d, updatedAt = :u',
            ExpressionAttributeValues: {
                ':d': dataLimit,
                ':u': Date.now(),
            },
        }

        await dbbClient.update(params).promise()
        return 'Update Successful'
    } catch (error) {
        throw new DatabaseError()
    }
}
