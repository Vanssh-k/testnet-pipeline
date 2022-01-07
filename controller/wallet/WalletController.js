const ethers = require("ethers");
const CryptoJS = require("crypto-js");
const config = require("../../config");
const EthCrypto = require("eth-crypto");

// generate public private key pair here
exports.create_wallet = async (req, res) => {
  const identity = EthCrypto.createIdentity();
  identity["privateKeyEncrypted"] = CryptoJS.AES.encrypt(
    identity["privateKey"],
    req.body.password
  ).toString();
  const publicKey = EthCrypto.publicKeyByPrivateKey(identity["privateKey"]);
  const address = EthCrypto.publicKey.toAddress(publicKey);
  identity["publicKey"] = address;
  delete identity["address"];
  res.status(200).json(identity);
};

// get balance of matic tokens
exports.get_balance = async (req, res) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      config[req.body.network][req.body.chain]["rpc"]
    );

    const balance = await provider.getBalance(req.body.publicKey);
    // balance = ethers.utils.formatEther(balance);
    res.status(200).json({ data: Number(balance) });
  } catch (err) {
    res.status(500);
  }
};
