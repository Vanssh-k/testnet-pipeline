const ethers = require("ethers");

const lighthouse_config = require("../../lighthouse.config");
const { lighthouseAbi } = require("../../contract_abi/lighthouseAbi");

exports.get_uploads = async (req, res) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      lighthouse_config[req.query.network]["rpc"]
    );

    const contract = new ethers.Contract(
      lighthouse_config[req.query.network]["lighthouse_contract_address"],
      lighthouseAbi,
      provider
    );

    const response = await contract.queryFilter("StorageRequest", 26228791);

    const walletTransaction = [];
    for (let i = 0; i < response.length; i++) {
      if (response[i]["args"]["uploader"] === req.query.publicKey) {
        walletTransaction.push({
          cid: response[i]["args"]["cid"],
          fileCost: Number(response[i]["args"]["fileCost"]),
        });
      }
    }

    res.status(200).json(walletTransaction);
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
