const dbbClient = require("./ddbClient");
const { bulkCIDAdd } = require("../controller/libs/constants");

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
