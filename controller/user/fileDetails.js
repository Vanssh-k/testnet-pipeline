const dbbClient = require("../libs/ddbClient");
const { fileTable } = require("../libs/constants");

module.exports = async (usersPublicKey) => {
  try {
    const params = {
      TableName: fileTable,
      IndexName: "publicKey-createdAt-index",
      KeyConditionExpression: "publicKey = :p",
      ExpressionAttributeValues: {
        ":p": usersPublicKey.trim().toLowerCase(),
      },
    };

    const record = await dbbClient.query(params).promise();
    return record;
  } catch (error) {
    return null;
  }
};
