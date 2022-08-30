const chalk = require("chalk");
const dbbClient = require("../../repository/ddbClient");
const { bulkCIDAdd } = require("../libs/constants");

module.exports = async (record) => {
  try {
    const params = {
      TableName: bulkCIDAdd,
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
