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

export interface IDeductionDetails {
  index: number
  totalNumOfDeduction: number
  nextDeductionInNumOfBlocks: number
  amount: number
  isActive: boolean
  detail: Detail // Using Detail interface for structured data
}
interface Detail {
  planName: string
  storageInGB: number
  bandwidthInGB: number
}

function parseDetail(detail: string): Detail | null {
  try {
    // Try parsing the detail string as JSON
    return JSON.parse(detail)
  } catch (error) {
    try {
      // If JSON parsing fails, try fixing the format and parsing again
      const fixedDetail = detail.replace(/(\w+):/g, '"$1":').replace(/'/g, '"')
      return JSON.parse(fixedDetail)
    } catch (error) {
      // If it still fails, return null or handle the error as appropriate
      console.error('Error parsing detail:', detail)
      return null
    }
  }
}
// Not in use currently
const getPurchasablePlans = async (): Promise<{
  activePurchasablePlans: IDeductionDetails[]
}> => {
  const data = await LighthouseBillingContract.getActivePlanList()
  return {
    activePurchasablePlans: data.map((elem: any) => ({
      index: parseInt(elem[0]), // Index of currently active plans
      totalNumOfDeduction: parseInt(elem[1]), // The frequency of deduction
      nextDeductionInNumOfBlocks: parseInt(elem[2]), // How long until the next deduction in block number
      amount: parseInt(elem[3]), // The amount to the deducted in dollars * 1e6(RATE_DENOMINATOR)
      isActive: elem[4], // Check active status of plan
      detail: parseDetail(elem[5].trim()),
    })),
  }
}

export { getSubscriptionStatus, getPurchasablePlans }
