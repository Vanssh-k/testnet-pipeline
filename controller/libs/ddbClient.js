const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  region: "ap-south-1",
});

module.exports = new AWS.DynamoDB.DocumentClient();
