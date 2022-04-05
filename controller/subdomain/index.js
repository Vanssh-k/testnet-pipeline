const AWS = require("aws-sdk");

const subDomainTable = "SubDomainManagement";

AWS.config.update({
  aws_table_name: subDomainTable,
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  region: "ap-south-1",
});
const client = new AWS.DynamoDB.DocumentClient();

exports.add_subdomain = async (req, res) => {
  try {
    const timestamp = Date.now();
    const params = {
      TableName: subDomainTable,
      Item: {
        publicKey: req.body.publicKey.toLowerCase(),
        subDomain: req.body.subDomain,
        txHash: "",
        createdAt: timestamp,
        lastUpdate: timestamp,
      },
    };

    client.put(params, function (err, data) {
      if (err) {
        console.error(err);
        res.status(500).json("Internal Server Error");
      } else {
        console.log("PutItem succeeded:");
        res.status(200).json("PutItem succeeded:");
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

exports.check_subdomain = async (req, res) => {
  try {
    const params = {
      TableName: subDomainTable,
      FilterExpression: "subDomain = :s",
      ExpressionAttributeValues: {
        ":s": req.query.subDomain,
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
          res.status(200).send({
            message: "Verified",
          });
        } else {
          res.status(401).send({
            message: "UnAuthorized",
          });
        }
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
