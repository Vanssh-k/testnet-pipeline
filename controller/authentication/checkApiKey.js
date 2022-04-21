const dbbClient = require("../libs/ddbClient");
const { userTable } = require("../libs/constants");

module.exports = async (apiKey) => {
  try {
    const params = {
      TableName: userTable,
      FilterExpression: "apiKey = :K",
      ExpressionAttributeValues: {
        ":K": apiKey,
      },
    };

    const record = await dbbClient.scan(params).promise();
    const { Items } = record;
    return Items[0];
  } catch (error) {
    return false;
  }
};
