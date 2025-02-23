import updateUserDataLimit from '../../../db/user/updateUserDataLimit.js'
import { getSubscriptionStatus } from './billing.js'
import { paymentPlans } from '../../../config/paymentPlans.js'
import CustomError from '../../../middlewares/error/customError.js'
import getReferral from '../../../db/user/referral/getReferral.js'
import { referralBonusPercentage } from '../../../config/constants.js'
import { Plan } from '../../../types/payment.js'

const getActivePlanList = async (): Promise<Plan[]> => {
  const filterPlans: Plan[] = []
  for (let i = 0; i < paymentPlans.length; i++) {
    filterPlans.push({
      subscriptionId: paymentPlans[i]['index'],
      totalNumOfDeduction: paymentPlans[i]['totalNumOfDeduction'],
      amount: paymentPlans[i]['amount'],
      planName: paymentPlans[i]['planName'],
      dataCap: paymentPlans[i]['storageInGB'],
      bandwidth: paymentPlans[i]['bandwidthInGB'],
      dedicatedGateway: paymentPlans[i]['dedicatedGateway'],
    })
  }
  return filterPlans
}

const getPlanDetails = async (planId: string): Promise<{ status: number; data: Plan }> => {
  const planList = await getActivePlanList()
  let i
  for (i = 0; i < planList.length; i++) {
    if (planList[i].subscriptionId === parseInt(planId)) {
      break
    }
  }
  return { status: 200, data: planList[i] }
}

const usersActivePlan = async (publicKey: string, subId: number): Promise<{ status: number; data: any }> => {
  const { status, subscriptionId } = await getSubscriptionStatus(publicKey, subId)
  console.log(status)
  console.log(subscriptionId)
  if (!status) {
    if (subscriptionId > Number.MAX_SAFE_INTEGER) {
      return {
        status: 401,
        data: { message: 'kindly purchase an active plan' },
      }
    }
    // TODO: Replace message with plan details
    // throw new ForbiddenError();
    return {
      status: 401,
      data: {
        message: `kindly renew or upgrade your plan subscriptionId: ${subscriptionId.toString()}`,
      },
    }
  }

  const planDetails = await getPlanDetails(subscriptionId.toString())
  return {
    status: 200,
    data: {
      subscriptionId: subscriptionId.toString(),
      planDetails: planDetails.data,
    },
  }
}

const activatePlan = async (userRecord: any, subId: number): Promise<{ status: number; data: { message: string } }> => {
  const activePlan = await usersActivePlan(userRecord.publicKey, subId)
  if (activePlan.status !== 200) {
    throw new CustomError(403, `No active plan for user ${userRecord.publicKey}`)
  }
  const dataCapPurchased = parseInt(`${activePlan?.data?.planDetails?.dataCap ?? 0}`, 10) * 1073741824 //GB converted to bytes

  // update datacap
  if (dataCapPurchased) {
    const updateDataCapResponse = await updateUserDataLimit(userRecord.publicKey, dataCapPurchased)
    console.log('plan updated')

    // Fetch referred_by from the database
    const referral = await getReferral(userRecord.publicKey)
    if (referral && referral.referredBy) {
      const bonusDataCap = dataCapPurchased * referralBonusPercentage
      await updateUserDataLimit(referral.referredBy, bonusDataCap)
      console.log('referral bonus updated')
    }
  }

  return {
    status: 200,
    data: { message: 'Plan activated!!!' },
  }
}

export { getActivePlanList, getPlanDetails, usersActivePlan, activatePlan }
