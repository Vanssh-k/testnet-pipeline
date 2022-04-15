const AWS = require("aws-sdk");
const ethers = require("ethers");
const SHA256 = require("crypto-js/sha256");

const tableName = "Users";
AWS.config.update({
  aws_table_name: tableName,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-south-1",
});
const client = new AWS.DynamoDB.DocumentClient();

const verify = (usersPublicKey, originalMessage, signedMessage) => {
  try {
    const sig = ethers.utils.splitSignature(signedMessage);
    const publicKeyToVerify = ethers.utils
      .verifyMessage(originalMessage, sig)
      .toLowerCase();
    if (usersPublicKey === publicKeyToVerify) {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};

exports.verify_signer = async (usersPublicKey, signedMessage) => {
  const params = {
    TableName: tableName,
    FilterExpression: "publicKey = :p",
    ExpressionAttributeValues: {
      ":p": usersPublicKey,
    },
  };

  return new Promise(function (resolve, reject) {
    client.scan(params, function (err, data) {
      if (err) {
        res.status(500).send({
          message: "Internal Server Error",
        });
      }
      const { Items } = data;
      if (Items.length > 0) {
        const authentic = verify(
          usersPublicKey,
          Items[0]["message"],
          signedMessage
        );
        if (authentic) {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  });
};

const check_for_apiKey = async (apiKey) => {
  const params = {
    TableName: tableName,
    FilterExpression: "apiKey = :K",
    ExpressionAttributeValues: {
      ":K": apiKey,
    },
  };

  return new Promise(function (resolve, reject) {
    client.scan(params, function (err, data) {
      if (err) {
        reject(false);
      } else {
        const { Items } = data;
        resolve(Items[0]);
      }
    });
  });
};

exports.verify_api_key = async (apiKey) => {
  const record = await check_for_apiKey(SHA256(apiKey).toString());

  if (record) {
    return true;
  } else {
    return false;
  }
};
