const axios = require("axios");
var ethers = require('ethers');
const { abi } = require("../../contract_abi/abi");

// temporary key for client
// query example - 24h
exports.user_token = async (req, res) => {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.EST_API_KEY}`,
      Accept: "application/json",
    };

    const response = await axios.post(
      `https://api.estuary.tech/user/api-keys?perms=upload&expiry=${req.query.expiry_time}`,
      {},
      { headers: headers }
    );
    res.status(200).json(response.data);
  } catch (e) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

// get metadata around the storage per CID
exports.status = async (req, res) => {
  try{
    const headers = {
      Authorization: `Bearer ${process.env.EST_API_KEY}`,
      Accept: "application/json",
    };

    const response = await axios.get(
      `https://api.estuary.tech/content/by-cid/${req.params.cid}`,
      { headers: headers }
    );
    res.status(200).json(response.data);
  } catch (e) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

// list all of the data you have pinned to Estuary
// example offset=0&limit=10
exports.list_data = async (req, res) => {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.EST_API_KEY}`,
      Accept: "application/json",
    };

    const response = await axios.get(
      `https://api.estuary.tech/content/stats?offset=${req.query.offset}&limit=${req.query.limit}`,
      { headers: headers }
    );
    res.status(200).json(response.data);
  } catch (e) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

// get all of the content on Estuary that is also stored on Filecoin
exports.get_deals_filecoin = async (req, res) => {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.EST_API_KEY}`,
      Accept: "application/json",
    };

    const response = await axios.get("https://api.estuary.tech/content/deals", {
      headers: headers,
    });
    res.status(200).json(response.data);
  } catch (e) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

// get all of the deals being made for a specific Content ID stored
exports.get_deals = async (req, res) => {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.EST_API_KEY}`,
      Accept: "application/json",
    };

    const response = await axios.get(
      `https://api.estuary.tech/content/status/${req.query.content_id}`,
      { headers: headers }
    );
    res.status(200).json(response.data);
  } catch (e) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
}

// get all of the deals being made for a specific Content ID stored
exports.get_quote = async (req, res) => {
  try{
    const response = await axios.get(`https://api.covalenthq.com/v1/137/address/${req.body.publicKey}/balances_v2/?key=${process.env.COVALENT_API_KEY}`);
    
    let matic_price_usd = 0
    let current_balance = 0
    for(let i=0; i<response.data.data.items.length; i++){
      if(response.data.data.items[i].contract_ticker_symbol === 'MATIC'){
        current_balance = response.data.data.items[i].balance
        matic_price_usd = response.data.data.items[i].quote_rate
        break;
      }
    }
    
    const fileSize = parseInt(req.body.fileSize)/(1024*1024*1024);
    const cost_usd = fileSize*7;
    const cost_matic = cost_usd/matic_price_usd;

    const address = "0x073Ab1C0CAd3677cDe9BDb0cDEEDC2085c029579";
    const provider = ethers.getDefaultProvider();
    const erc20 = new ethers.Contract(address, abi, provider);
    
    const gasFee = (await erc20.estimateGas.store(req.body.ipfs_hash, {})).toNumber();
    
    res.status(200).json({
      fileSize: fileSize,
      cost: cost_matic,
      current_balance: current_balance,
      gasFee: gasFee,
    });
  } catch(e){
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
}
