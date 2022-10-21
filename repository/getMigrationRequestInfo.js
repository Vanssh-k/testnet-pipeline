const chalk = require("chalk");
const dbbClient = require("./ddbClient");
const { migrationRequestTable } = require("../controller/libs/constants");

module.exports = async (requestId) => {
  try {
    const params = {
      TableName: migrationRequestTable,
      Key: {
        id: requestId
      },
    };

    const record = await dbbClient.get(params).promise();
    return record.Item;
  } catch (error) {
    console.log(
      chalk.yellow("User Detail Fetch Error: ") + chalk.red(error.message)
    );
    return null;
  }
};
//-5f27-47e4-98ee-19c830362efe