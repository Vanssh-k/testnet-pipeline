const AWS = require("aws-sdk");
const ethers = require("ethers");
const SHA256 = require("crypto-js/sha256");

const { v4: uuidv4 } = require("uuid");

const tableName = "Users";
AWS.config.update({
  aws_table_name: tableName,
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
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

exports.verify_signer = async (req, res) => {
  try {
    const usersPublicKey = req.query.publicKey.toLowerCase();
    const params = {
      TableName: tableName,
      FilterExpression: "publicKey = :p",
      ExpressionAttributeValues: {
        ":p": usersPublicKey,
      },
    };

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
          req.query.signed_message
        );
        authentic
          ? res.status(200).json("Authorized")
          : res.status(401).json("UnAuthorized");
      } else {
        res.status(401).json("UnAuthorized");
      }
    });
  } catch (e) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

const returning_user = async (publicKey) => {
  const params = {
    TableName: tableName,
    FilterExpression: "publicKey = :p",
    ExpressionAttributeValues: {
      ":p": publicKey,
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

exports.get_message = async (req, res) => {
  try {
    const publicKey = req.query.publicKey.toLowerCase();
    const record = await returning_user(publicKey);

    const message = uuidv4().toString();

    const params = {
      TableName: tableName,
      Item: {
        publicKey: publicKey,
        message: message,
        dataLimit: record ? record.dataLimit : 1073741824,
        dataUsed: record ? record.dataUsed : 0,
        apiKey: record ? record.apiKey : null,
      },
    };

    client.put(params, function (err, data) {
      if (err) {
        console.error(err);
        res.status(500).json("Internal Server Error");
      } else {
        console.log("PutItem succeeded:");
        res.status(200).json(message);
      }
    });
  } catch (e) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

exports.user_data_usage = async (req, res) => {
  try {
    const publicKey = req.query.publicKey.toLowerCase();
    const record = await returning_user(publicKey);

    if (record) {
      res.status(200).json({
        dataLimit: record.dataLimit,
        dataUsed: record.dataUsed,
      });
    } else {
      res.status(404).send("user does not exist");
    }
  } catch (e) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

exports.get_api_key = async (req, res) => {
  const usersPublicKey = req.query.publicKey.toLowerCase();
  const record = await returning_user(usersPublicKey);

  if (record) {
    const authentic = verify(
      usersPublicKey,
      record["message"],
      req.query.signed_message
    );
    if (authentic) {
      const apiKey = uuidv4().toString();
      const params = {
        TableName: tableName,
        Item: {
          publicKey: record.publicKey,
          message: record.message,
          dataLimit: record.dataLimit,
          dataUsed: record.dataUsed,
          apiKey: SHA256(apiKey).toString(),
        },
      };

      client.put(params, function (err, data) {
        if (err) {
          console.error(err);
          res.status(500).json("Internal Server Error");
        } else {
          console.log("PutItem succeeded:");
          res.status(200).json(apiKey);
        }
      });
    } else {
      res.status(401).json("UnAuthorized");
    }
  } else {
    res.status(401).json("UnAuthorized");
  }
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

exports.verify_api_key = async (req, res) => {
  const record = await check_for_apiKey(SHA256(req.query.apiKey).toString());

  if (record) {
    res.status(200).json({
      publicKey: record.publicKey,
    });
  } else {
    res.status(401).json("UnAuthorized");
  }
};
