const dbbClient = require("../libs/ddbClient");
const { fileTableEncryption } = require("../libs/constants");

module.exports = async (publicKey) => {
  try {
    const params = {
      TableName: fileTableEncryption,
      FilterExpression: "publicKey = :p",
      ExpressionAttributeValues: {
        ":p": publicKey.toLowerCase(),
      },
    };

    const record = await dbbClient.scan(params).promise();
    const { Items } = record;
    return Items;
  } catch (error) {
    return null;
  }
};
