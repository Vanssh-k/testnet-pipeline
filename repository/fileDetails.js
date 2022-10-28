const dbbClient = require("./ddbClient");
const { fileTable } = require("../controller/libs/constants");

module.exports = async (usersPublicKey) => {
  try {
    const params = {
      TableName: fileTable,
      IndexName: "publicKey-createdAt-index",
      ScanIndexForward: false,
      KeyConditionExpression: "publicKey = :p",
      ExpressionAttributeValues: {
        ":p": usersPublicKey,
      },
    };

    const record = await dbbClient.query(params).promise();
    const { Items } = record;
    return Items;
  } catch (error) {
    return null;
  }
};
