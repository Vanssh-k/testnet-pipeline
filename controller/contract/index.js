const ethers = require("ethers");

const Moralis = require("moralis/node");
const serverUrl = process.env.serverUrl;

const lighthouseConfig = require("../../lighthouse.config");

const AWS = require("aws-sdk");

const fileTable = "FileManagement";
AWS.config.update({
  aws_table_name: fileTable,
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  region: "ap-south-1",
});
const client = new AWS.DynamoDB.DocumentClient();

const moralisAppId = process.env.moralisAppId;
Moralis.start({ serverUrl, moralisAppId });

const getLogs = async (network, contractAddress, publicKey) => {
  const options = {
    topic1: "0x000000000000000000000000" + publicKey,
    chain: network,
    address: contractAddress,
  };

  const events = await Moralis.Web3API.native.getLogsByAddress(options);
  return events;
};

exports.get_uploads_contract = async (req, res) => {
  try {
    const abi = [
      "event StorageRequest(address indexed uploader, string cid, string config, uint fileCost, string fileName, uint fileSize, uint timestamp)",
    ];
    const iface = new ethers.utils.Interface(abi);

    const publicKey = req.query.publicKey.toString();
    const contractAddress =
      lighthouseConfig[req.query.network]["lighthouse_contract_address"];
    const walletTransaction = [];

    const logs = await getLogs(
      req.query.network,
      contractAddress,
      publicKey.substring(2, publicKey.toString().length)
    );

    for (let i = 0; i < logs.result.length; i++) {
      const log = iface.parseLog({
        topics: [logs.result[i].topic0, logs.result[i].topic1],
        data: logs.result[i].data,
      });
      walletTransaction.push({
        cid: log.args[1],
        config: log.args[2],
        fileCost: log.args[3],
        fileName: log.args[4],
        fileSize: log.args[5],
        timestamp: log.args[6],
      });
    }

    res.status(200).send(walletTransaction);
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

exports.get_uploads = async (req, res) => {
  try {
    const params = {
      TableName: fileTable,
      FilterExpression: "publicKey = :P",
      ExpressionAttributeValues: {
        ":P": req.query.publicKey.toLowerCase(),
      },
    };
  
    client.scan(params, function (err, data) {
      if (err) {
        res.status(500).send("Internal Server Error!!!");
      } else {
        const { Items } = data;
        res.status(200).send(Items);
      }
    });

  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
