const chalk = require('chalk');
const dbbClient = require('../ddbClient');
const { migrationRequestTable } = require('../../controller/libs/constants');
const DatabaseError = require('../../errors/database-error');

module.exports = async (record) => {
  try {
    const params = {
      TableName: migrationRequestTable,
      Item: record,
    };

    const save = await dbbClient.put(params).promise();
    return save;
  } catch (error) {
    console.log(
      chalk.yellow('Order save error: ') + chalk.red(error.message),
    );
    throw new DatabaseError();
  }
};
