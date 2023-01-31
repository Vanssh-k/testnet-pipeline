const dbbClient = require("../ddbClient");
const fileBundleRecords = "file-bundle-records";
const DatabaseError = require('../../errors/database-error');

module.exports = async (cid) => {
  try {
    const params = {
      TableName: fileBundleRecords,
      IndexName: 'cid-index',
      KeyConditionExpression: 'cid = :c',
      ExpressionAttributeValues: {
        ':c': cid,
      },
    };

    const record = await dbbClient.query(params).promise();
    const { Items } = record;
    return Items;
  } catch (error) {
    throw new DatabaseError();
  }
};
