const axios = require("axios");

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
    // const whitelisted = await check_deposit(req.body.signer.address);
    const whitelisted = true;
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

exports.add_cid = async (req, res) => {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.EST_API_KEY}`,
      Accept: "application/json",
    };

    const response = await axios.post(
      `https://api.estuary.tech/content/add-ipfs`,
      {
        name: req.body.name,
        root: req.body.cid,
      },
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
exports.get_ticker = async (req, res) => {
  try {
    // const token_prices = await axios.get(
    //   `https://api.covalenthq.com/v1/pricing/tickers/?quote-currency=USD&format=JSON&page-size=1&tickers=${
    //     config["mainnet"][req.body.chain]["symbol"]
    //   }&key=${process.env.COVALENT_API_KEY}`
    // );

    const token_prices = await axios.get(
      `https://data.messari.io/api/v1/assets/${req.query.symbol}/metrics/market-data`
    );

    const token_price_usd = token_prices.data.data.market_data.price_usd;

    res.status(200).json(token_price_usd);
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
