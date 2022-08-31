const dbbClient = require("./ddbClient");
const { cidOrderTable } = require("../controller/libs/constants");

module.exports = async (publicKey) => {
  try{
    const params = {
      TableName: cidOrderTable,
      FilterExpression: "publicKey = :p",
      ExpressionAttributeValues: {
        ":p": publicKey,
      },
    };
  
    const record = await dbbClient.scan(params).promise();
    const { Items } = record;
    return Items;
  } catch(error) {
    return null;
  }
};
