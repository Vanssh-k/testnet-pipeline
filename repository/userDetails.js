const chalk = require("chalk");
const dbbClient = require("./ddbClient");
const { userTable } = require("../controller/libs/constants");

module.exports = async (usersPublicKey, network) => {
  try {
    const params = {
      TableName: userTable,
      Key: {
        publicKey: network==="evm"?usersPublicKey.trim().toLowerCase():usersPublicKey,
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
