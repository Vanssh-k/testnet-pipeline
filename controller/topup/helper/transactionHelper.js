const {
    userTransactions,
} = require('../../../repository/topup/userTransactions')

const getUserTransactionDetails = async (publicKey) => {
    const record = await userTransactions(publicKey)
    return record
}

module.exports = { getUserTransactionDetails }
