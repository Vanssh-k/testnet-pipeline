const axios = require("axios");
const ethers = require("ethers");
const config = require("../../config");
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
  try {
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
};

// get all of the deals being made for a specific Content ID stored
exports.get_quote = async (req, res) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      config[req.body.chain]['rpc']
    );
    const current_balance = await provider.getBalance(req.body.publicKey);

    const token_prices = await axios.get(
      `https://api.covalenthq.com/v1/pricing/tickers/?quote-currency=USD&format=JSON&tickers=${config[req.body.chain]['symbol']}&page-size=1&key=${process.env.COVALENT_API_KEY}`
    );
    const token_price_usd = token_prices.data.data.items[0]["quote_rate"];

    const fileSize = parseInt(req.body.fileSize) / (1024 * 1024 * 1024);
    const cost_usd = fileSize * 7;
    const file_cost = cost_usd / token_price_usd;
    
    const contract = new ethers.Contract(config[req.body.chain]['contract_address'], abi, provider);
    
    const gasFee = (
      await contract.estimateGas.store(req.body.ipfs_hash, {})
    ).toNumber();
    
    res.status(200).json({
      cost: file_cost,
      current_balance: Number(current_balance),
      gasFee: gasFee,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

exports.push_cid_tochain = async (req, res) => {
  try {
    // const provider = new ethers.providers.EtherscanProvider(network = "homestead", apiKey = process.env.ETHERSCAN_API_KEY);
    const provider = new ethers.providers.JsonRpcProvider(
      config[req.body.chain]['rpc']
    );
    const wallet = new ethers.Wallet(req.body.privateKey, provider);
    const contract = new ethers.Contract(config[req.body.chain]['contract_address'], abi, wallet);

    const txResponse = await contract.store(
      req.body.cid,
      {}//,
      // { value: ethers.utils.parseEther(req.body.cost) }
    );

    const txReceipt = await txResponse.wait();

    res.status(200).json(txReceipt);
  } catch (e) {
    res.status(500);
  }
};
