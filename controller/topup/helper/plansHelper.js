const updateUserDataLimit = require('../../../repository/user/updateUserDataLimit')
const {
    getSubscriptionStatus,
    getPurchasablePlans,
} = require('../../../services/blockchain/billing')

const NotFoundError = require('../../../errors/not-found-error')

const getActivePlanList = async () => {
    const planDetails = (await getPurchasablePlans()).activePurchasablePlans
    const filterPlans = []
    for (let i = 0; i < planDetails.length; i++) {
        const temp = planDetails[i].detail.split(",")
        filterPlans.push({
            subscriptionId: Number(planDetails[i].index),
            planName: temp[0].split(":")[1].replace(/['"]+/g, '').trim(),
            dataCap: parseInt(temp[1].split(":")[1].replace(/['"]+/g, '').trim()),
            bandwidth: parseInt(temp[2].split(":")[1].replace(/['"]+/g, '').trim()),
            dedicatedGateway: parseInt(temp[3].split(":")[1].replace(/['"]+/g, '').trim()),
            frequencyOfDeduction: planDetails[i].frequencyOfDeduction,
            nextDeductionInNumOfBlocks:
                planDetails[i].nextDeductionInNumOfBlocks,
            amount: Number(planDetails[i].amount),
            detail: planDetails[i].detail,
        })
    }
    return filterPlans
}

const usersActivePlan = async (publicKey) => {
    const { status, subscriptionId } = await getSubscriptionStatus(publicKey)

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
    return {
        status: 200,
        data: { status, subscriptionId: subscriptionId.toString() },
    }
}

const getPlanDetails = async (planId) => {
    const planList = await getActivePlanList()
    let i;
    for (i = 0; i < planList.length; i++) {
        if (planList[i].subscriptionId === parseInt(planId)) {
            break
        }
    }
    return {status: 200, data: planList[i]}
}

const activatePlan = async (userRecord) => {
    const activePlan = await usersActivePlan(userRecord.publicKey)
    if (activePlan.status !== 200) {
        return {
            status: 403,
            data: {
                message: `No active plan for user ${userRecord.publicKey}`,
            },
        }
    }

    const planDetails = await getPlanDetails(activePlan.data.subscriptionId)
    if (!planDetails) {
        throw new NotFoundError('Plan does not exist')
    }

    const dataCapPurchased = parseInt(planDetails.data.dataCap)

    // update datacap
    if (dataCapPurchased) {
        const newDataLimit = parseInt(userRecord.dataLimit) + dataCapPurchased
        const updateDataCapResponse = await updateUserDataLimit(
            userRecord.publicKey,
            newDataLimit
        )
    }

    return {
        status: 200,
        data: { message: 'Plan activated!!!' },
    }
}

module.exports = { getActivePlanList, getPlanDetails, usersActivePlan, activatePlan }
