const AWS = require("aws-sdk");
const ethers = require("ethers");
const { v4: uuidv4 } = require("uuid");

const tableName = "user";
AWS.config.update({
  aws_table_name: tableName,
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  region: "ap-south-1",
});
const client = new AWS.DynamoDB.DocumentClient();

exports.verify_signer = async (req, res) => {
  try {
    const params = {
      TableName: tableName,
      FilterExpression: "publicKey = :p",
      ExpressionAttributeValues: {
        ":p": req.query.publicKey,
      },
    };

    client.scan(params, function (err, data) {
      if (err) {
        res.status(500).send({
          message: "Internal Server Error",
        });
      } else {
        const { Items } = data;
        if (Items.length > 0) {
          try {
            const sig = ethers.utils.splitSignature(req.query.signed_message);
            const publicKey = ethers.utils.verifyMessage(
              Items[0]["message"],
              sig
            );
            if (req.query.publicKey === publicKey.toLowerCase()) {
              res.status(200).json("Authorized");
            } else {
              res.status(401).json("UnAuthorized");
            }
          } catch {
            res.status(401).json("UnAuthorized");
          }
        } else {
          res.status(401).json("UnAuthorized");
        }
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

    let message = "";
    if(record){
      message = req.query.new_message ? uuidv4().toString() : record.message
    }

    const params = {
      TableName: tableName,
      Item: {
        publicKey: publicKey,
        message: message,
        dataLimit: record ? record.dataLimit : 1,
        dataUsed: record ? record.dataUsed : 0,
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

    if(record){
      res.status(200).json({
        dataLimit: record.dataLimit,
        dataUsed: record.dataUsed,
      });
    } else{
      res.status(404).send("user does not exist");
    }
  } catch (e) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};