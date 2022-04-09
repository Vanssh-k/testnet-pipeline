const AWS = require("aws-sdk");

const {verify_signer, verify_api_key} = require("./verify");

const subDomainTable = "SubDomainManagement";

AWS.config.update({
  aws_table_name: subDomainTable,
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  region: "ap-south-1",
});
const client = new AWS.DynamoDB.DocumentClient();

const getTransactionDetails = async(publicKey) =>{
  const params = {
    TableName: subDomainTable,
    FilterExpression: "publicKey = :p",
    ExpressionAttributeValues: {
      ":p": publicKey,
    },
  };

  return new Promise(function (resolve, reject) {
    client.scan(params, function (err, data) {
      if (err) {
        console.log(err);
        resolve(null);
      } else {
        const { Items } = data;
        if (Items.length > 0) {
          resolve(Items[0])
        } else {
          resolve(null);
        }
      }
    });
  });
}

const updateSubDomain = async(transactionDetails) =>{
  console.log(transactionDetails)
  const params = {
    TableName: subDomainTable,
    Item: transactionDetails,
  };

  return new Promise(function (resolve, reject) {
    client.put(params, function (err, data) {
      if (err) {
        console.log(err);
        resolve(false);
      } else {
        console.log("PutItem succeeded:");
        resolve(true);
      }
    });
  });
}

exports.add_subdomain = async (req, res) => {
  try{
    let verified = false;
    const publicKey = req.body.publicKey.toLowerCase()
    if(req.body.signed_message){
      verified = await verify_signer(publicKey, req.body.signed_message);
    }else{
      verified = await verify_api_key(req.body.apiKey);
    }

    if(verified){
      const transactionDetails = await getTransactionDetails(publicKey);
      if(transactionDetails.txHash && (transactionDetails.publicKey.toLowerCase()===publicKey)){
        transactionDetails.lastUpdate = Date.now();
        transactionDetails.subDomain = req.body.subDomain;
        const response = await updateSubDomain(transactionDetails);
        console.log(response)
        if(response){
          res.status(200).json("SubDomain Created");
        } else{
          res.status(500).json("Internal server error");
        }
      } else{
        res.status(401).json("UnAuthorized");
      }
    } else{
      res.status(401).json("UnAuthorized");
    }
  } catch (e){
    console.log(e);
    res.status(500).json('Internal Server Error');
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

exports.get_subdomain = async (req, res) => {
  try {
    const params = {
      TableName: subDomainTable,
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
          res.status(200).send({
            subDomain: Items[0]["subDomain"],
          });
        } else {
          res.status(200).send({
            subDomain: null,
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