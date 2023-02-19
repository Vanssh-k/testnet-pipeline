const dbbClient = require('../ddbClient')
const carBundleRecords = 'car-bundle-records'
const DatabaseError = require('../../errors/database-error')

module.exports = async (id) => {
    try {
        const params = {
            TableName: carBundleRecords,
            Key: {
                bundleId: id,
            },
        }

        const record = await dbbClient.get(params).promise()
        return record.Item
    } catch (error) {
        throw new DatabaseError()
    }
}
