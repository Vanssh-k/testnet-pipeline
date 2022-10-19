const dbbClient = require("./ddbClient");
const { migrationRequestTable } = require("../controller/libs/constants");

module.exports = async (publicKey) => {
  try{
    const params = {
      TableName: migrationRequestTable,
      IndexName: "publicKey-createdAt-index",
      KeyConditionExpression: "publicKey = :p",
      ExpressionAttributeValues: {
        ":p": publicKey,
      },
    };
  
    const record = await dbbClient.query(params).promise();
    const { Items } = record;
    return Items;
  } catch(error) {
    return null;
  }
};
