import { ethers } from 'ethers'
import envConfig from '../../../config'
import billingABI from '../../../contract_abi/billing'

const polygonProvider = new ethers.JsonRpcProvider(envConfig.polygon_rpc)
const LighthouseBillingContract = new ethers.Contract(
  envConfig.lighthouse_billing_address,
  billingABI,
  polygonProvider
)

const getSubscriptionStatus = async (publicKey: string, subId: number) => {
  const data = await LighthouseBillingContract.getSubscriptionStatus(
    publicKey,
    subId
  )
  return { status: data[0], subscriptionId: data[1] }
}

// Not in use currently
const getPurchasablePlans = async () => {
  const data = await LighthouseBillingContract.getActivePlanList()
  return { activePurchasablePlans: data }
}

export { getSubscriptionStatus, getPurchasablePlans }
