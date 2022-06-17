const dbbClient = require("../libs/ddbClient");
const { fileTableEncryption } = require("../libs/constants");
const { v4: uuidv4 } = require("uuid");

module.exports = async (record) => {
  try {
    const id = uuidv4();
    const timestamp = Date.now();
    record["id"] = id;
    record["createdAt"] = timestamp;
    record["lastUpdate"] = timestamp;
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
