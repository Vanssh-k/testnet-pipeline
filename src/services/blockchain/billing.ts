import billingABI from '../../abi/billing'
import { ethers } from 'ethers'
import envConfig from '../../config'

const mumbaiProvider = new ethers.providers.JsonRpcProvider(
    envConfig.polygon_rpc
)

const mumbaiBillingContract = new ethers.Contract(
    envConfig.lighthouse_billing_address,
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
