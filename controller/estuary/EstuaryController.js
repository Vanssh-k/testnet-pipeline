const axios = require("axios");
const ethers = require("ethers");

const config = require("../../config");
const { depositAbi } = require("../../contract_abi/depositAbi");
const { lighthouseAbi } = require("../../contract_abi/lighthouseAbi");

const check_deposit = async (publicKey) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      config["mainnet"]["polygon"]["rpc"]
    );

    const contract = new ethers.Contract(
      config["mainnet"]["polygon"]["deposit_contract_address"],
      depositAbi,
      provider
    );

    const txResponse = await contract.listWhitelistAddresses();

    let whitelisted = false;
    for (let i = 0; i < txResponse.length; i++) {
      if (publicKey === txResponse[i]) {
        whitelisted = true;
        break;
      }
    }

    return whitelisted;
  } catch (e) {
    return {
      message: "Internal Server Error",
    };
  }
};

// temporary key for client
// query example - 24h
exports.user_token = async (req, res) => {
  try {
    // const provider = new ethers.providers.JsonRpcProvider(
    //   config[req.body.network][req.body.chain]["rpc"]
    // );
    // const contract = new ethers.Contract(
    //   config[req.body.network][req.body.chain]["deposit_contract_address"],
    //   depositAbi,
    //   provider
    // );
    // const wallet = new ethers.Wallet(req.body.privateKey, provider);
    const whitelisted = await check_deposit(req.body.signer.address);

    if (whitelisted) {
      const headers = {
        Authorization: `Bearer ${process.env.EST_API_KEY}`,
        Accept: "application/json",
      };

      const response = await axios.post(
        `https://api.estuary.tech/user/api-keys?perms=upload&expiry=${req.body.expiry_time}`,
        {},
        { headers: headers }
      );
      res.status(200).json(response.data);
    } else {
      res.status(403).json({
        message: "User has no deposit",
      });
    }
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
      config[req.body.network][req.body.chain]["rpc"]
    );
    const current_balance = await provider.getBalance(req.body.publicKey);

    const token_prices = await axios.get(
      `https://api.covalenthq.com/v1/pricing/tickers/?quote-currency=USD&format=JSON&page-size=1&tickers=${
        config[req.body.network][req.body.chain]["symbol"]
      }&key=${process.env.COVALENT_API_KEY}`
    );

    const token_price_usd = token_prices.data.data.items[0]["quote_rate"];

    const fileSize = parseInt(req.body.fileSize) / (1024 * 1024 * 1024);
    const cost_usd = fileSize * 7;
    const file_cost = cost_usd / token_price_usd;

    const contract = new ethers.Contract(
      config[req.body.network][req.body.chain]["lighthouse_contract_address"],
      lighthouseAbi,
      provider
    );

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
