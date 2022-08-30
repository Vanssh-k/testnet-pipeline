const dbbClient = require("../../repository/ddbClient");
const { fileTableEncryption } = require("../libs/constants");

module.exports = async (record) => {
  try {
    const params = {
      TableName: fileTableEncryption,
      Item: record,
    };

    await dbbClient.put(params).promise();
    return "Put Successful";
  } catch (error) {
    return null;
  }
};
