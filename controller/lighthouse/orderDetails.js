const dbbClient = require("../libs/ddbClient");
const { bulkCIDAdd } = require("../libs/constants");

module.exports = async (orderID) => {
  try{
    const params = {
      TableName: bulkCIDAdd,
      FilterExpression: "orderID = :o",
      ExpressionAttributeValues: {
        ":o": orderID,
      },
    };
  
    const record = await dbbClient.scan(params).promise();
    const { Items } = record;
    return Items;
  } catch(error) {
    return null;
  }
};
