const chalk = require("chalk");
const dbbClient = require("../libs/ddbClient");
const { userTable } = require("../libs/constants");

module.exports = async (usersPublicKey) => {
  try {
    const params = {
      TableName: userTable,
      Key: {
        publicKey: usersPublicKey.trim().toLowerCase(),
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
