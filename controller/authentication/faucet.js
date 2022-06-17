const dbbClient = require("../libs/ddbClient");
const { faucetTable } = require("../libs/constants");

const updateFaucet = async (updatedDetails) => {
  try {
    updatedDetails.publicKey = updatedDetails.publicKey.trim().toLowerCase();
    const params = {
      TableName: faucetTable,
      Item: updatedDetails,
    };

    await dbbClient.put(params).promise();
    return "Put Successful";
  } catch (error) {
    return null;
  }
};

const getDetails = async (usersPublicKey) => {
  try {
    const params = {
      TableName: faucetTable,
      FilterExpression: "publicKey = :p",
      ExpressionAttributeValues: {
        ":p": usersPublicKey.trim().toLowerCase(),
      },
    };

    const record = await dbbClient.scan(params).promise();
    const { Items } = record;

    return Items[0];
  } catch (error) {
    return null;
  }
};

module.exports = { updateFaucet, getDetails };
