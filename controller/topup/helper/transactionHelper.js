const { v4: uuidv4 } = require('uuid')
const { activatePlan } = require('./plansHelper')
const {
    getUserTransactions,
    recordTransactions,
} = require('../../../repository/topup/userTransactions')

const recordUserTransaction = async (bodyData, userRecord) => {
    const record = {
        id: uuidv4().toString(),
        txHash: bodyData.txHash,
        publicKey: userRecord.publicKey,
        tokenAddress: bodyData.tokenAddress,
        subscriptionID: bodyData.subscriptionID.toString(),
        network: bodyData.chain,
        createdAt: Date.now(),
    }
    const saveRecord = await recordTransactions(record)
    activatePlan(userRecord)
    return { status: 200, data: 'Success!!!' }
}

const getUserTransactionDetails = async (publicKey) => {
    const record = await getUserTransactions(publicKey)
    return record
}

module.exports = { recordUserTransaction, getUserTransactionDetails }
