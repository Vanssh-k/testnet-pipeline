const dbbClient = require("../libs/ddbClient");
const { userTable } = require("../libs/constants");

module.exports = async (apiKey) => {
  try {
    const params = {
      TableName: userTable,
      IndexName: "apiKey-index",
      KeyConditionExpression: "apiKey = :a",
      ExpressionAttributeValues: {
        ":a": apiKey,
      },
    };

    const record = await dbbClient.query(params).promise();
    const { Items } = record;
    return Items[0];
  } catch (error) {
    console.log(
      chalk.yellow("Check Api Key Error: ") + chalk.red(error.message)
    );
    return false;
  }
};
