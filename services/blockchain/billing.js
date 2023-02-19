const billingABI = require('../../abi/billing')
const { lighthouse_billing_address } = require('../../lighthouse.config')
const ethers = require('ethers')

const mumbaiProvider = new ethers.providers.JsonRpcProvider(
    process.env.POLYGON_RPC
)

const mumbaiBillingContract = new ethers.Contract(
    lighthouse_billing_address,
    billingABI,
    mumbaiProvider
)

const getSubscriptionStatus = async (publicKey) => {
    const data = await mumbaiBillingContract.subscriptionStatus(publicKey)
    return { status: data[0], subscriptionId: data[1] }
}

const getPurchasablePlans = async () => {
    const data = await mumbaiBillingContract.getActivePlans()
    return { activePurchasablePlans: data }
}

module.exports = { getSubscriptionStatus, getPurchasablePlans }
