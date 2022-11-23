const dbbClient = require('../ddbClient');
const { userTable } = require('../../controller/libs/constants');
const DatabaseError = require('../../errors/database-error');

module.exports = async (publicKey, dataUsed) => {
  try {
    const params = {
      TableName: userTable,
      Key: {
        publicKey,
      },
      UpdateExpression: 'set dataUsed = :d, updatedAt = :u',
      ExpressionAttributeValues: {
        ':d': dataUsed,
        ':u': Date.now(),
      },
    };

    await dbbClient.update(params).promise();
    return 'Update Successful';
  } catch (error) {
    throw new DatabaseError();
  }
};
