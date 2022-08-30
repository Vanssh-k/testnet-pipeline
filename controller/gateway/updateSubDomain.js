const dbbClient = require("../../repository/ddbClient");
const { gatewayTable } = require("../libs/constants");

module.exports = async (transactionDetails) => {
  try{
    const params = {
      TableName: gatewayTable,
      Item: transactionDetails,
    };
  
    await dbbClient.put(params).promise();
    return "Put Successful";
  } catch (error){
    return null;
  }
};
