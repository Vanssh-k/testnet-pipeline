const chalk = require("chalk");
const dbbClient = require("../../repository/ddbClient");
const { cidOrderTable } = require("../libs/constants");

module.exports = async (record) => {
  try {
    const params = {
      TableName: cidOrderTable,
      Item: record,
    };

    const save = await dbbClient.put(params).promise();
    return save;
  } catch (error) {
    console.log(
      chalk.yellow("Order save error: ") + chalk.red(error.message)
    );
    return null;
  }
};
