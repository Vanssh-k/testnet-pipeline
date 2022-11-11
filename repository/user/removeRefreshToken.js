const dbbClient = require("../ddbClient");
const { userTable } = require("../../controller/libs/constants");
const DatabaseError = require("../../errors/database-error");

module.exports = async (publicKey, refreshToken) => {
  try {
    const params = {
      TableName: userTable,
      Key: {
        "publicKey": publicKey,
      },
      UpdateExpression: 'set refreshToken = :r, updatedAt = :u',
      ExpressionAttributeValues: {
        ':r': refreshToken,
        ':u': Date.now()
      },
    };

    await dbbClient.update(params).promise();
    return "Update Successful";
  } catch (error) {
    throw new DatabaseError();
  }
};