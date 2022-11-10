const dbbClient = require("../ddbClient");
const { ProposalTable } = require("../../controller/libs/constants");
const DatabaseError = require("../../errors/database-error");

const addProposal = async (proposalDetail) => {
  try{
    const params = {
      TableName: ProposalTable,
      Item: proposalDetail,
    };
  
    await dbbClient.put(params).promise();
    return "Put Successful";
  } catch (error){
    throw new DatabaseError();
  }
};

const allProposals = async () => {
  try{
    const params = {
      TableName: ProposalTable,
    };
  
    const record = await dbbClient.scan(params).promise();
    const { Items } = record;
    return Items;
  } catch (error){
    throw new DatabaseError();
  }
};

module.exports = { addProposal, allProposals };
