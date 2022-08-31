const dbbClient = require("./ddbClient");
const { gatewayTable } = require("../controller/libs/constants");

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
