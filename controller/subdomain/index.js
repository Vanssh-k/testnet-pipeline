const AWS = require("aws-sdk");
const { default: axios } = require("axios");

const lighthouseConfig = require("../../lighthouse.config");
const {verify_signer, verify_api_key} = require("./verify");

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
    const network = req.body.network;
    const txHash = req.body.txHash;
    const chainId = lighthouseConfig[network]["chain_id"];

    let verified = false;
    if(req.body.signed_message){
      verified = await verify_signer(req.body.publicKey.toLowerCase(), req.body.signed_message);
    }else{
      verified = await verify_api_key(req.body.apiKey);
    }

    console.log("here")
    if(verified){
      console.log("here2")
      const txReceipt = (await axios.get("https://deep-index.moralis.io/api/v2/transaction/0x1cced4ed634aa2a4d4fc539f3c15c474b64c6194f50d757339b38cb0cfb817eb?chain=fantom",{ headers: { "x-api-key": process.env.moralisAPIKey }})).data
      console.log(txReceipt)
      const value = txReceipt["value"];
      const from = txReceipt.from_address.toLocaleLowerCase();
      const to = txReceipt.to_address.toLowerCase();
      console.log(value, to, from)
      if(value && to==="0xf468602B34C482f34ca498D9a0DE7957539961d3".toLocaleLowerCase() && from===req.body.publicKey.toLocaleLowerCase()){
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
      } else{
        res.status(500).json("Value error");
      }
    }
    
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
