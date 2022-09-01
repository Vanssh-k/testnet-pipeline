const dbbClient = require("./ddbClient");
const { governance } = require("../controller/libs/constants");

const addProposal = async (proposalDetail) => {
  try{
    const params = {
      TableName: governance,
      Item: proposalDetail,
    };
  
    await dbbClient.put(params).promise();
    return "Put Successful";
  } catch (error){
    return null;
  }
};

const allProposals = async () => {
  try{
    const params = {
      TableName: governance,
    };
  
    const record = await dbbClient.scan(params).promise();
    const { Items } = record;
    return Items;
  } catch (error){
    return null;
  }
};

module.exports = { addProposal, allProposals };
