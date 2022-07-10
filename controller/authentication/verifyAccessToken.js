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
    const { Items } = record;

    if(Items.length===0){
      return null;
    }
    
    return {
      publicKey: Items[0]["publicKey"],
      dataLimit: Items[0]["dataLimit"],
      dataUsed: Items[0]["dataUsed"]
    };
  } catch (error) {
    return null;
  }
};
