const dbbClient = require("../libs/ddbClient");
const { userTable } = require("../libs/constants");

module.exports = (usersPublicKey, accessToken) => {
  try {
    const params = {
      TableName: userTable,
      FilterExpression: "publicKey = :p",
      ExpressionAttributeValues: {
        ":p": usersPublicKey.trim().toLowerCase(),
      },
    };

    const record = await dbbClient.scan(params).promise();
    const { Items } = record;

    if (
      Items[0]["accessToken"] === SHA256(accessToken).toString() ||
      Items[0]["apiKey"] === SHA256(accessToken).toString()
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return null;
  }
};
