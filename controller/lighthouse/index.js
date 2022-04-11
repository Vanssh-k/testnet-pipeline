const axios = require("axios");
const updateUserDetails = require("../authentication/updateUserDetails");
const userDetails = require("../authentication/userDetails");
const saveFileMetaData = require("./saveFileMetaData");

// get ticker of a token by its symbol as input
exports.get_ticker = async (req, res) => {
  try {
    const token_prices = await axios.get(
      `https://data.messari.io/api/v1/assets/${req.query.symbol}/metrics/market-data`
    );

    const token_price_usd = token_prices.data.data.market_data.price_usd;
    res.status(200).json(token_price_usd);
  } catch {
    try {
      const token_prices = await axios.get(
        `https://api.covalenthq.com/v1/pricing/tickers/?quote-currency=USD&format=JSON&page-size=1&tickers=${req.query.symbol}&key=${process.env.COVALENT_API_KEY}`
      );
      res.status(200).json(token_prices.data.data["items"][0]["quote_rate"]);
    } catch (e) {
      res.status(500).send({
        message: "Internal Server Error",
      });
    }
  }
};

// get status of a CID, returns filecoin miner details
exports.cid_status = async (req, res) => {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.EST_API_KEY}`,
      Accept: "application/json",
    };

    const response = await axios.get(
      `https://api.estuary.tech/content/by-cid/${req.query.cid}`,
      { headers: headers }
    );
    res.status(200).json(response.data);
  } catch (e) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

const addCid = async (name, cid) =>{
  const headers = {
    Authorization: `Bearer ${process.env.EST_API_KEY}`,
    Accept: "application/json",
  };

  const response = await axios.post(
    `https://api.estuary.tech/content/add-ipfs`,
    {
      name: name,
      root: cid,
    },
    { headers: headers }
  );

  return response.data;
}
// add cid for filecoin deal
exports.add_cid = async (req, res) => {
  try {
    const response = await addCid(req.body.name, req.body.cid)
    res.status(200).json(response);
  } catch (e) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

// Add file to queue for bundled transaction
exports.add_cid_to_queue = async (req, res) => {
  try {
    const publicKey = req.body.publicKey.toLowerCase();
    const record = await userDetails(publicKey);  // Get record of user

    if (req.body.size <= record.dataLimit - record.dataUsed) {
      // Create record of file
      await saveFileMetaData(
        publicKey,
        req.body.cid,
        req.body.name,
        req.body.size,
        "queued"
      );

      // Update data usage
      const updatedDetails = {
        publicKey: publicKey,
        message: record.message,
        dataLimit: record.dataLimit,
        dataUsed: record.dataUsed + req.body.size,
        apiKey: record.apiKey,
      };
      const updateResponse = await updateUserDetails(updatedDetails);

      // Send CID to Estuary
      const addCidResponse = await addCid(
        req.body.name,
        req.body.cid
      );

      res.status(200).json(addCidResponse);
    } else {
      // Create record of file
      await saveFileMetaData(
        publicKey,
        req.body.cid,
        req.body.name,
        req.body.size,
        "payment pending"
      );
      res.status(500).json("Uploaded more than allowed limit");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
