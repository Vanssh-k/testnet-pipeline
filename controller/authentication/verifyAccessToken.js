const SHA256 = require("crypto-js/sha256");

const dbbClient = require("../libs/ddbClient");
const { userTable } = require("../libs/constants");

module.exports = async (accessToken) => {
  try {
    const params = {
      TableName: userTable,
      FilterExpression: "accessToken = :a",
      ExpressionAttributeValues: {
        ":a": SHA256(accessToken).toString(),
      },
    };

    const record = await dbbClient.scan(params).promise();

    if(!record){
      return null;
    }
    
    return {
      publicKey: record["publicKey"],
      dataLimit: record["dataLimit"],
      dataUsed: record["dataUsed"]
    };
  } catch (error) {
    return null;
  }
};
