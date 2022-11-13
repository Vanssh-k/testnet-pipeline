const dbbClient = require('../ddbClient');
const { userTable } = require('../../controller/libs/constants');
const DatabaseError = require('../../errors/database-error');

module.exports = async (publicKey, dataLimit, faucet) => {
  try {
    const params = {
      TableName: userTable,
      Key: {
        publicKey,
      },
      UpdateExpression: 'set dataLimit = :d, faucet = :f, updatedAt = :u',
      ExpressionAttributeValues: {
        ':d': dataLimit,
        ':f': faucet,
        ':u': Date.now(),
      },
    };

    await dbbClient.update(params).promise();
    return 'Update Successful';
  } catch (error) {
    throw new DatabaseError();
  }
};
