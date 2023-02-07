const { getSubscriptionStatus, getPurchasablePlans } = require('../../../services/blockchain/billing');

const getActivePlanList = async () => {
  const planDetails = (await getPurchasablePlans()).activePurchasablePlans;
  const filterPlans = [];
  for(let i=0; i<planDetails.length; i++){
    filterPlans.push({
        index: Number(planDetails[i]["index"]),
        frequencyOfDeduction: planDetails[i]["frequencyOfDeduction"],
        nextDeductionInNumOfBlocks: planDetails[i]["nextDeductionInNumOfBlocks"],
        amount: Number(planDetails[i]["amount"]),
        detail: planDetails[i]["detail"]
      });
  };
  return (filterPlans);
};

const usersActivePlan = async (publicKey) => {
  const { status, subscriptionId } = await getSubscriptionStatus(publicKey);

  if (!status) {
    if (subscriptionId > Number.MAX_SAFE_INTEGER) {
      return {
        status: 401,
        data: { message: 'kindly purchase an active plan' }
      }
    }
    // TODO: Replace message with plan details
    // throw new ForbiddenError();
    return {
      status: 401,
      data: { message: `kindly renew or upgrade your plan subscriptionId: ${subscriptionId.toString()}` }
    }
  }
  return {
    status: 200,
    data: { status, subscriptionId: subscriptionId.toString() }
  }
};

const getPlanDetails = async(planId) =>{
  const planList = await getActivePlanList();
  const planToReturn = null;
  for(let i=0; i<planList.length; i++){
    if(planList[i]["id"]===planId){
      planToReturn = planList[i];
      break;
    }
  }
  return planToReturn;
}

const activatePlan = async(publicKey) =>{
  const activePlan = await usersActivePlan(publicKey);
  if(activePlan.status!==200){
    return({
      status: 403,
      data: {message: `No active plan for user ${publicKey}`}
    });
  }

  const planDetails = await getPlanDetails(activePlan.data.subscriptionId);
  if(!planDetails){

  }
  const planDetailsJSON = JSON.parse(planDetails);
  const dataCapPurchased = parseInt(planDetailsJSON["data"]);
  console.log(dataCapPurchased);
  // update datacap


  return({
    status: 200,
    data:{message: "Plan activated!!!"}
  });
}

module.exports = { getActivePlanList, usersActivePlan, activatePlan }
