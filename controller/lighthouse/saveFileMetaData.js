const dbbClient = require("../libs/ddbClient");
const { fileTable } = require("../libs/constants");
const { v4: uuidv4 } = require("uuid");

module.exports = async (publicKey, cid, fileName, fileSizeInBytes, status) => {
  try {
    const id = uuidv4();
    const timestamp = Date.now();
    const params = {
      TableName: fileTable,
      Item: {
        id: id,
        publicKey: publicKey,
        cid: cid,
        fileName: fileName,
        fileSizeInBytes: fileSizeInBytes,
        status: status,
        txHash: "",
        createdAt: timestamp,
        lastUpdate: timestamp,
      },
    };

    await dbbClient.put(params).promise();
    return "Put Successful";
  } catch (error) {
    return null;
  }
};
