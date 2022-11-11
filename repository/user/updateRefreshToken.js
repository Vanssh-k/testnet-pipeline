const dbbClient = require("../ddbClient");
const { userTable } = require("../../controller/libs/constants");
const DatabaseError = require("../../errors/database-error");

module.exports = async (publicKey, message, refreshToken) => {
  try {
    const params = {
      TableName: userTable,
      Key: {
        "publicKey": publicKey,
      },
      UpdateExpression: 'set message = :m, refreshToken = :r, updatedAt = :u',
      ExpressionAttributeValues: {
        ':m': message,
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