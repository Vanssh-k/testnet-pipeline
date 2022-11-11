const dbbClient = require("../ddbClient");
const { userTable } = require("../../controller/libs/constants");
const DatabaseError = require("../../errors/database-error");

module.exports = async (publicKey, message, apiKey) => {
  try {
    const params = {
      TableName: userTable,
      Key: {
        "publicKey": publicKey,
      },
      UpdateExpression: 'set message = :m, updatedAt = :u, apiKey = :a',
      ExpressionAttributeValues: {
        ':a': apiKey,
        ':m': message,
        ':u': Date.now()
      },
    };

    await dbbClient.update(params).promise();
    return "Update Successful";
  } catch (error) {
    throw new DatabaseError();
  }
};