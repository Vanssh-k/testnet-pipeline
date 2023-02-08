
const dbbClient = require('../ddbClient')
const { userTable } = require('../../controller/libs/constants')
const DatabaseError = require('../../errors/database-error')
const { generateToken } = require('../../utils/randomToken')

module.exports = async (updatedDetails, network) => {
    try {
        if (network === 'evm') {
            updatedDetails.publicKey = updatedDetails.publicKey
                .trim()
                .toLowerCase()
        }

        // Secondary Index null case
        if (updatedDetails.apiKey === '') {
            updatedDetails.apiKey = generateToken()
        }

        const params = {
            TableName: userTable,
            Item: updatedDetails,
        }

        await dbbClient.put(params).promise()
        return 'Put Successful'
    } catch (error) {
        throw new DatabaseError()
    }
}
