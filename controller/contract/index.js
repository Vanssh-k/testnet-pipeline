const ethers = require("ethers");

const config = require("../../config");
const { lighthouseAbi } = require("../../contract_abi/lighthouseAbi");

exports.get_uploads = async (req, res) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      config[req.query.network][req.query.chain]["rpc"]
    );
    
    const contract = new ethers.Contract(
      config[req.query.network][req.query.chain]["lighthouse_contract_address"],
      lighthouseAbi,
      provider
    );

    const response = await contract.queryFilter("StorageRequest");

    const walletTransaction = [];
    for(let i=0; i<response.length; i++){
      if(response[i]["args"]["uploader"] === req.query.publicKey){
        walletTransaction.push({
          cid: response[i]["args"]["cid"],
          fileCost: Number(response[i]["args"]["fileCost"]),
        });
      }
    }

    res.status(200).json(walletTransaction);
  } catch (e) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};