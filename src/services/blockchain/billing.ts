import billingABI from '../../abi/billing'
import config from '../../lighthouse.config'
import { ethers } from 'ethers'

const mumbaiProvider = new ethers.providers.JsonRpcProvider(
    process.env.POLYGON_RPC
)

const mumbaiBillingContract = new ethers.Contract(
    config.lighthouse_billing_address,
    billingABI,
    mumbaiProvider
)

const getSubscriptionStatus = async (publicKey: string) => {
    const data = await mumbaiBillingContract.subscriptionStatus(publicKey)
    return { status: data[0], subscriptionId: data[1] }
}

const getPurchasablePlans = async () => {
    const data = await mumbaiBillingContract.getActivePlans()
    return { activePurchasablePlans: data }
}

export { getSubscriptionStatus, getPurchasablePlans }
