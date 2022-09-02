const SHA256 = require("crypto-js/sha256");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const checkTwitter = require("./checkTwitter");
const updateUserDetails = require("../../repository/updateUserDetails");
const { freeDataLimitInBytes } = require("../libs/constants");
const ForbiddenError = require("../../errors/forbidden");

// Return access token if user is authentic
exports.verify_signer = async (req, res, next) => {
  try {
    const record = req.user;
    // Change the message and return access token
    const payLoad = { publicKey: record.publicKey };
    const accessToken = jwt.sign(payLoad, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "12h",
    });
    const refreshToken = jwt.sign(payLoad, process.env.JWT_REFRESH_SECRET, {
      algorithm: "HS256",
    });

    let date = new Date(); // Now
    date = date.setDate(date.getDate() + 7); // Expire in 7 days
    const message = date;

    const updatedDetails = {
      publicKey: record.publicKey,
      message: message,
      dataLimit: record.dataLimit,
      dataUsed: record.dataUsed,
      apiKey: record.apiKey,
      encryptionPublicKey: record.encryptionPublicKey,
      accessToken: refreshToken,
      tokenExpires: date,
      faucet: record.faucet,
    };

    const _ = await updateUserDetails(updatedDetails);

    res
      .status(200)
      .json({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (error) {
    next(error);
  }
};

// Return if user is authentic along with his data usage
exports.verify_access_token = async (req, res, next) => {
  try {
    const record = req.user;

    res.status(200).json({
      publicKey: record.publicKey,
      dataLimit: record.dataLimit,
      dataUsed: record.dataUsed,
    });
  } catch (error) {
    next(error);
  }
};

exports.refresh_access_token = async (req, res, next) => {
  try {
    const record = req.user;
    const payLoad = { publicKey: record.publicKey };
    const accessToken = jwt.sign(payLoad, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "12h",
    });

    res.status(200).json({ accessToken: accessToken });
  } catch (error) {
    next(error);
  }
};

exports.remove_refresh_access_token = async (req, res, next) => {
  try {
    const record = req.user;

    const updatedDetails = {
      publicKey: record.publicKey,
      message: record.message,
      dataLimit: record.dataLimit,
      dataUsed: record.dataUsed,
      apiKey: record.apiKey,
      encryptionPublicKey: record.encryptionPublicKey,
      accessToken: null,
      tokenExpires: record.tokenExpires,
      faucet: record.faucet,
    };

    const _ = await updateUserDetails(updatedDetails);

    res.status(200).json("Logout Success!!!");
  } catch (error) {
    next(error);
  }
};

// Get message - user will sign this message to verify himself
exports.get_message = async (req, res, next) => {
  try {
    const publicKey = req.query.publicKey;
    const record = req.user;
    const message = 
      "Please prove you are owner of this wallet by signing this message\r\nnonce=" + Date.now();

    const updatedDetails = {
      publicKey: publicKey,
      message: message,
      dataLimit: record ? record.dataLimit : freeDataLimitInBytes,
      dataUsed: record ? record.dataUsed : 0,
      apiKey: record
        ? record.apiKey === ""
          ? SHA256(uuidv4().toString()).toString()
          : record.apiKey
        : SHA256(uuidv4().toString()).toString(),
      encryptionPublicKey: record ? record.encryptionPublicKey : "",
      accessToken: record ? record.accessToken : "",
      tokenExpires: record ? record.tokenExpires : 0,
      faucet: record ? record.faucet : {},
    };

    const _ = await updateUserDetails(updatedDetails);

    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

exports.get_api_key = async (req, res, next) => {
  try {
    const record = req.user;
    const apiKey = uuidv4().toString();
    const updatedDetails = {
      publicKey: record.publicKey,
      message: uuidv4().toString(),
      dataLimit: record.dataLimit,
      dataUsed: record.dataUsed,
      apiKey: SHA256(apiKey).toString(),
      encryptionPublicKey: record.encryptionPublicKey,
      accessToken: record.accessToken,
      tokenExpires: record.tokenExpires,
      faucet: record.faucet,
    };

    const _ = await updateUserDetails(updatedDetails);

    res.status(200).json(apiKey);
  } catch (error) {
    next(error);
  }
};

exports.verify_api_key = async (req, res, next) => {
  try {
    const record = req.user;
    res.status(200).json({
      publicKey: record.publicKey,
      dataLimit: record.dataLimit,
      dataUsed: record.dataUsed,
    });
  } catch (error) {
    next(error);
  }
};

exports.tweet_recharge = async (req, res, next) => {
  try {
    const twitterID = req.query.twitterID;
    const record = req.user;

    // Check if user have already used faucet
    if (record["faucet"]["twitter"] === "used") {
      throw new ForbiddenError();
    }

    // Check for validity of tweet
    const validTweet = await checkTwitter(record.publicKey, twitterID);
    if (!validTweet) {
      throw new ForbiddenError();
    }

    // Update Data Limit
    const updatedDetails = {
      publicKey: record.publicKey,
      message: record.message,
      dataLimit: record.dataLimit + freeDataLimitInBytes,
      dataUsed: record.dataUsed,
      apiKey: record.apiKey,
      encryptionPublicKey: record.encryptionPublicKey,
      accessToken: record.accessToken,
      tokenExpires: record.tokenExpires,
      faucet: { twitter: "used" },
    };

    const _ = await updateUserDetails(updatedDetails);

    res.status(200).json("Data Limit Upgraded");
  } catch (error) {
    next(error);
  }
};
