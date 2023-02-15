const updateUserDataLimit = require('../../../repository/user/updateUserDataLimit')
const {
    getSubscriptionStatus,
    getPurchasablePlans,
} = require('../../../services/blockchain/billing')
const { subscriptionPlanDetails } = require("../../libs/constants")

const NotFoundError = require('../../../errors/not-found-error')

const getActivePlanList = async () => {
    const filterPlans = []
    for(let i=0; i<subscriptionPlanDetails.length; i++){
        filterPlans.push({
            subscriptionId: subscriptionPlanDetails[i]["index"],
            totalNumOfDeduction: subscriptionPlanDetails[i]["totalNumOfDeduction"],
            nextDeductionInNumOfBlocks: subscriptionPlanDetails[i]["nextDeductionInNumOfBlocks"],
            amount: subscriptionPlanDetails[i]["amount"],
            planName: subscriptionPlanDetails[i]["planName"],
            dataCap: subscriptionPlanDetails[i]["ipfsGBStorage"],
            bandwidth: subscriptionPlanDetails[i]["bandwidthInGB"],
            dedicatedGateway: subscriptionPlanDetails[i]["dedicatedGateway"]
        });
    };
    return filterPlans
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

    const planDetails = await getPlanDetails(subscriptionId.toString())
    return {
        status: 200,
        data: {
            subscriptionId: subscriptionId.toString(),
            planDetails: planDetails.data
        },
    }
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

    const dataCapPurchased = parseInt(activePlan.data.planDetails.dataCap)*1073741824 //GB converted to bytes

    // update datacap
    if (dataCapPurchased) {
        const newDataLimit = parseInt(userRecord.dataLimit) + dataCapPurchased
        const updateDataCapResponse = await updateUserDataLimit(
            userRecord.publicKey,
            newDataLimit
        )
        console.log("plan updated")
    }

    return {
        status: 200,
        data: { message: 'Plan activated!!!' },
    }
}

module.exports = { getActivePlanList, getPlanDetails, usersActivePlan, activatePlan }
