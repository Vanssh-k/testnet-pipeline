const { getActivePlanList, usersActivePlan, activatePlan } = require("./helper/plansHelper");
const { createSubDomain, subDomainExists, getUserSubDomainDomain } = require("./helper/subDomain");
const { getUserTransactionDetails } = require("./helper/transactionHelper");

exports.create_subdomain = async (req, res, next) => {
  try{
    const data = await createSubDomain(req.body.publicKey, req.body.subDomain);
    res.status(data.status).json({data: data.data});
  } catch(error){
    next(error);
  }
};

exports.check_subdomain = async (req, res, next) => {
  try {
    const exists = await subDomainExists(req.query.subDomain);
    res.status(200).json(exists);
  } catch (error) {
    next(error);
  }
};

exports.get_subdomain = async (req, res, next) => {
  try {
    const record = await getUserSubDomainDomain(req.query.publicKey);
    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
};

exports.get_user_transaction_details = async (req, res, next) => {
  try {
    const record = await getUserTransactionDetails(req.query.publicKey);
    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
};

exports.get_active_plan_list = async (req, res, next) => {
  try{
    const planList = await getActivePlanList();
    res.status(200).send(planList);
  } catch(error){
    console.log(error);
    next(error);
  }
}

exports.users_active_plan = async (req, res, next) => {
  try{
    const data = await usersActivePlan(req.body.publicKey);
    res.status(data.status).json({data: data.data});
  } catch(error){
    next(error);
  }
};

exports.activate_plan = async (req, res, next) => {
  try{
    const data = await activatePlan(req.query.publicKey);
    res.status(data.status).json({data: data.data});
  } catch(error){
    next(error);
  }
};
