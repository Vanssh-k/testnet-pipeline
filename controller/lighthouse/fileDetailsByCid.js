const dbbClient = require("../libs/ddbClient");
const { fileTable } = require("../libs/constants");

module.exports = async (cid) => {
  const params = {
    TableName: fileTable,
    FilterExpression: "cid = :c",
    ExpressionAttributeValues: {
      ":c": cid,
    },
  };

  const record = await dbbClient.scan(params).promise();
  const { Items } = record;
  return Items[0];
};
