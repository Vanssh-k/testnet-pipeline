const axios = require("axios");
const updateUserDetails = require("../authentication/updateUserDetails");
const userDetails = require("../authentication/userDetails");
const saveFileMetaData = require("./saveFileMetaData");

const ForbiddenError = require("../../errors/forbidden");
const DatabaseError = require("../../errors/database-error");
const NotFoundError = require("../../errors/not-found-error");
const BadRequestError = require("../../errors/bad-request");

// get ticker of a token by its symbol as input
exports.get_ticker = async (req, res, next) => {
  try {
    const token_prices = (
      await axios.get(
        `https://data.messari.io/api/v1/assets/${req.query.symbol}/metrics/market-data`
      )
    ).data;

    const token_price_usd = token_prices.data.market_data.price_usd;
    res.status(200).json(token_price_usd);
  } catch (error) {
    next(error);
  }
};

// get status of a CID, returns filecoin miner details
exports.cid_status = async (req, res, next) => {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.EST_API_KEY}`,
      Accept: "application/json",
    };

    const response = (
      await axios.get(
        `https://api.estuary.tech/content/by-cid/${req.query.cid}`,
        { headers: headers }
      )
    ).data;

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const addCid = async (name, cid) => {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.EST_API_KEY}`,
      Accept: "application/json",
    };

    const response = (
      await axios.post(
        `https://api.estuary.tech/content/add-ipfs`,
        {
          name: name,
          root: cid,
        },
        { headers: headers }
      )
    ).data;

    return response;
  } catch (error) {
    return null;
  }
};

// add cid for filecoin deal
exports.add_cid = async (req, res, next) => {
  try {
    const addCidResponse = await addCid(req.body.name, req.body.cid);
    if (!addCidResponse) {
      throw new BadRequestError();
    }

    res.status(200).json("Added To Queue");
  } catch (error) {
    next(error);
  }
};

// Add file to queue for bundled transaction
exports.add_cid_to_queue = async (req, res, next) => {
  try {
    const publicKey = req.body.publicKey.toLowerCase();
    const record = await userDetails(publicKey); // Get record of user

    if (!record) {
      throw new NotFoundError();
    }

    if (req.body.size > record.dataLimit - record.dataUsed) {
      // Create record of file
      await saveFileMetaData(
        publicKey,
        req.body.cid,
        req.body.name,
        req.body.size,
        "payment pending"
      );

      throw new ForbiddenError();
    }

    // Create record of file
    const saveFileResponse = await saveFileMetaData(
      publicKey,
      req.body.cid,
      req.body.name,
      req.body.size,
      "queued"
    );
    if (!saveFileResponse) {
      throw new DatabaseError("Save File failed");
    }

    // Update data usage
    const updatedDetails = {
      publicKey: publicKey,
      message: record.message,
      dataLimit: record.dataLimit,
      dataUsed: parseInt(record.dataUsed) + parseInt(req.body.size),
      apiKey: record.apiKey,
      encryptionPublicKey: encryptionPublicKey,
      accessToken: record.accessToken,
      tokenExpires: record.tokenExpires,
      faucet: record.faucet
    }; 

    const updateResponse = await updateUserDetails(updatedDetails);
    if (!updateResponse) {
      throw new DatabaseError("Put item failed");
    }

    // Send CID to Estuary
    const addCidResponse = await addCid(req.body.name, req.body.cid);

    if (!addCidResponse) {
      throw new DatabaseError("Add CID Failed");
    }

    res.status(200).json("Success");
  } catch (error) {
    next(error);
  }
};
