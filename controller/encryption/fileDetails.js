const dbbClient = require("../libs/ddbClient");
const { fileTableEncryption } = require("../libs/constants");

module.exports = async (cid) => {
  try {
    const params = {
      TableName: fileTableEncryption,
      FilterExpression: "cid = :c",
      ExpressionAttributeValues: {
        ":c": cid,
      },
    };

    const record = await dbbClient.scan(params).promise();
    const { Items } = record;
    return Items[0];
  } catch (error) {
    return null;
  }
};
