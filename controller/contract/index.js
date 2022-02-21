const axios = require("axios");
const ethers = require("ethers");

const lighthouse_config = require("../../lighthouse.config");

exports.get_uploads = async (req, res) => {
  try {
    let user_transactions = await axios.get(
      `https://api.covalenthq.com/v1/${
        lighthouse_config[req.query.network]["chain_id"]
      }/address/${req.query.publicKey}/transactions_v2/?key=${
        process.env.COVALENT_API_KEY
      }`
    );

    const provider = new ethers.providers.JsonRpcProvider(
      lighthouse_config["fantom"]["rpc"]
    );

    const abi = [
      "event StorageRequest(address indexed uploader, string cid, string config, uint fileCost, string fileName, uint fileSize, uint timestamp)",
    ];
    const iface = new ethers.utils.Interface(abi);

    user_transactions = user_transactions.data.data.items;
    const walletTransaction = [];

    for (let i = 0; i < user_transactions.length; i++) {
      if (
        user_transactions[i]["to_address"] ===
        lighthouse_config[req.query.network][
          "lighthouse_contract_address"
        ].toLowerCase()
      ) {
        if (user_transactions[i]["log_events"].length > 0) {
          const receipt = await provider.getTransactionReceipt(
            user_transactions[i]["tx_hash"]
          );
          const log = iface.parseLog(receipt.logs[0]);
          walletTransaction.push({
            cid: log.args[1],
            config: log.args[2],
            fileCost: log.args[3],
            fileName: log.args[4],
            fileSize: log.args[5],
            timestamp: log.args[6],
          });
        }
      }
    }

    res.status(200).send(walletTransaction);
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
