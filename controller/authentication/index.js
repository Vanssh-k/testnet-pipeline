const AWS = require('aws-sdk');
const ethers = require("ethers");
const { v4: uuidv4 } = require('uuid');

const tableName = 'UserAuth';
AWS.config.update({
  aws_table_name: tableName,
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  region: 'ap-south-1',
});
const client = new AWS.DynamoDB.DocumentClient();

exports.verify_signer = async (req, res) => {
  try {
    const params = {
      TableName: tableName,
      FilterExpression: "publicKey = :p",
      ExpressionAttributeValues: {
        ":p": req.query.publicKey,
      }
    };

    client.scan(params, function (err, data) {
      if (err) {
        res.status(500).send({
          message: "Internal Server Error",
        });
      } else {
        const { Items } = data;
        if(Items.length > 0) {
          try{
            const sig = ethers.utils.splitSignature(req.query.signed_message);
            const publicKey = ethers.utils.verifyMessage(
              Items[0]["message"], sig
            );
            if(req.query.publicKey===publicKey){
              res.status(200).json("Authorized");
            } else{
              res.status(401).json("UnAuthorized");
            }
          } catch{
            res.status(401).json("UnAuthorized");
          }
        } else{
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

exports.get_message = async (req, res) => {
  try {
    const message = uuidv4();
    const params = {
      TableName: tableName,
      Item: {
        "ID": message,
        "publicKey": req.query.publicKey,
        "message": message.toString(),
      }
    };

    client.put(params, function(err, data) {
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
