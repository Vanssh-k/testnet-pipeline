const ethers = require("ethers");

const Moralis = require("moralis/node");
const serverUrl = process.env.SERVERURL;

const lighthouseConfig = require("../../lighthouse.config");

const moralisAppId = process.env.MORALISAPPID;
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

module.exports = async (usersPublicKey) => {
  const Items = [];
  const abi = [
    "event StorageRequest(address indexed uploader, string cid, string config, uint fileCost, string fileName, uint fileSize, uint timestamp)",
  ];
  const iface = new ethers.utils.Interface(abi);

  let network = "polygon";
  let contractAddress =
    lighthouseConfig[network]["lighthouse_contract_address"];
  // const walletTransaction = [];

  let logs = await getLogs(
    network,
    contractAddress,
    usersPublicKey.substring(2, usersPublicKey.toString().length)
  );

  for (let i = 0; i < logs.result.length; i++) {
    const log = iface.parseLog({
      topics: [logs.result[i].topic0, logs.result[i].topic1],
      data: logs.result[i].data,
    });
    Items.push({
      cid: log.args[1],
      fileName: log.args[4],
      fileSizeInBytes: Number(log.args[5]),
      status: "processed",
      txHash: "",
      createdAt: Number(log.args[6]),
      lastUpdate: Number(log.args[6]),
      id: i,
      publicKey: usersPublicKey,
      network: "polygon",
    });
  }

  network = "fantom";
  contractAddress = lighthouseConfig[network]["lighthouse_contract_address"];

  logs = await getLogs(
    network,
    contractAddress,
    usersPublicKey.substring(2, usersPublicKey.toString().length)
  );

  for (let i = 0; i < logs.result.length; i++) {
    const log = iface.parseLog({
      topics: [logs.result[i].topic0, logs.result[i].topic1],
      data: logs.result[i].data,
    });
    Items.push({
      cid: log.args[1],
      fileName: log.args[4],
      fileSizeInBytes: Number(log.args[5]),
      status: "processed",
      txHash: "",
      createdAt: Number(log.args[6]),
      lastUpdate: Number(log.args[6]),
      id: i,
      publicKey: usersPublicKey,
      network: "fantom",
    });
  }

  return Items;
};
