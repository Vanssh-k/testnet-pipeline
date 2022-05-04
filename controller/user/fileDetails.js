const dbbClient = require("../libs/ddbClient");
const { fileTable } = require("../libs/constants");

module.exports = async (usersPublicKey) => {
  const params = {
    TableName: fileTable,
    FilterExpression: "publicKey = :p",
    ExpressionAttributeValues: {
      ":p": usersPublicKey.trim().toLowerCase(),
    },
  };

  const record = await dbbClient.scan(params).promise();
  const { Items } = record;
  return Items;
};
