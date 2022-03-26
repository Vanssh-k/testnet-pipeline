const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid")

const fileTable = "FileManagement";
AWS.config.update({
  aws_table_name: fileTable,
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  region: "ap-south-1",
});
const client = new AWS.DynamoDB.DocumentClient();

module.exports = async (publicKey, cid, fileName, fileSizeInBytes, status) => {
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
      lastUpdate: timestamp
    },
  };

  client.put(params, function (err, data) {
    if (err) {
      console.error(err);
      return "error";
    } else {
      console.log("PutItem succeeded:");
      return "updated";
    }
  });
};