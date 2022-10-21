const dbbClient = require("./ddbClient");
const { migrationCIDs } = require("../controller/libs/constants");

module.exports = async (requestID) => {
  try{
    const params = {
      TableName: migrationCIDs,
      IndexName: "requestID-index",
      KeyConditionExpression: "requestID = :r",
      ExpressionAttributeValues: {
        ":r": requestID,
      },
    };
  
    const record = await dbbClient.query(params).promise();
    const { Items } = record;
    return Items;
  } catch(error) {
    return null;
  }
};
