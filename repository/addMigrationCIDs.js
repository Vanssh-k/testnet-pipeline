const chalk = require("chalk");
const dbbClient = require("./ddbClient");
const { migrationCIDs } = require("../controller/libs/constants");

module.exports = async (record) => {
  try {
    const params = {
      TableName: migrationCIDs,
      Item: record,
    };

    const save = await dbbClient.put(params).promise();
    return save;
  } catch (error) {
    console.log(
      chalk.yellow("CID save error: ") + chalk.red(error.message)
    );
    return null;
  }
};
