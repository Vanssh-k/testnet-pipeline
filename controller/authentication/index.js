const SHA256 = require("crypto-js/sha256");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const web3 = require("web3");

const userDetails = require("./userDetails");
const checkApiKey = require("./checkApiKey");
const checkTwitter = require("./checkTwitter");
const verifySignature = require("./verifySignature");
const updateUserDetails = require("./updateUserDetails");
const { freeDataLimitInBytes } = require("../libs/constants");

const AuthenticationError = require("../../errors/authentication-error");
const NotFoundError = require("../../errors/not-found-error");
const ForbiddenError = require("../../errors/forbidden");
const RequestValidationError = require("../../errors/request-validation-error");

// Return access token if user is authentic
exports.verify_signer = async (req, res, next) => {
  try {
    const usersPublicKey = req.body.publicKey;
    const signedMessage = req.body.signedMessage;
    const record = await userDetails(usersPublicKey);
    const authentic = verifySignature(
      usersPublicKey,
      record.message,
      signedMessage
    );

    if (!authentic) {
      throw new AuthenticationError();
    }

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

    const updatedDetails = {
      publicKey: record.publicKey,
      message: uuidv4().toString(),
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

const verifyJWT = (accessToken) => {
  try {
    const userData = jwt.verify(accessToken, process.env.JWT_SECRET);
    return userData;
  } catch {
    return null;
  }
};

// Return if user is authentic along with his data usage
exports.verify_access_token = async (req, res, next) => {
  try {
    const accessToken = req.headers["authorization"].split(" ")[1];
    const userData = verifyJWT(accessToken);

    if (!userData) {
      throw new AuthenticationError();
    }

    const record = await userDetails(userData.publicKey);

    res.status(200).json({
      publicKey: record.publicKey,
      dataLimit: record.dataLimit,
      dataUsed: record.dataUsed,
    });
  } catch (error) {
    next(error);
  }
};

// Get message - user will sign this message to verify himself
exports.get_message = async (req, res, next) => {
  try {
    const publicKey = req.query.publicKey;
    if (!web3.utils.isAddress(publicKey)) {
      throw new RequestValidationError([{ msg: "Invalid public key!!!" }]);
    }

    const record = await userDetails(publicKey); // Check if user already exist
    const message = uuidv4().toString();

    const updatedDetails = {
      publicKey: publicKey,
      message: message,
      dataLimit: record ? record.dataLimit : freeDataLimitInBytes,
      dataUsed: record ? record.dataUsed : 0,
      apiKey: record ? (record.apiKey===""?SHA256(uuidv4().toString()).toString():record.apiKey) : SHA256(uuidv4().toString()).toString(),
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
    const usersPublicKey = req.body.publicKey;
    const signedMessage = req.body.signedMessage;

    const record = await userDetails(usersPublicKey);
    if (!record) {
      throw new NotFoundError();
    }

    const authentic = verifySignature(
      usersPublicKey,
      record.message,
      signedMessage
    );

    if (!authentic) {
      throw new AuthenticationError();
    }

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
    const apiKey = req.headers["authorization"].split(" ")[1];
    const record = await checkApiKey(SHA256(apiKey).toString());
    if (!record) {
      throw new NotFoundError();
    }
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
    const usersPublicKey = req.query.publicKey;
    const twitterID = req.query.twitterID;
    const token = req.headers["authorization"].split(" ")[1]; // can be api key or access token

    const record = await userDetails(usersPublicKey);

    // Check if user already exist
    if (!record) {
      throw new NotFoundError();
    }

    // Check if user authentic
    if (SHA256(token).toString() !== record["accessToken"]) {
      throw new AuthenticationError();
    }

    // Check if user have already used faucet
    if (record["faucet"]["twitter"] === "used") {
      throw new ForbiddenError();
    }

    // Check for validity of tweet
    const validTweet = await checkTwitter(usersPublicKey, twitterID);
    if (!validTweet) {
      throw new ForbiddenError();
    }

    // Update Data Limit
    const updatedDetails = {
      publicKey: usersPublicKey,
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

exports.save_encryption_publicKey = async (req, res, next) => {
  try {
    const usersPublicKey = req.body.publicKey;
    const encryptionPublicKey = req.body.encryptionPublicKey;
    const accessToken = req.headers["authorization"].split(" ")[1];

    const record = await userDetails(usersPublicKey);
    let authentic = false;
    if (
      SHA256(accessToken).toString() === record["accessToken"] ||
      SHA256(accessToken).toString() === record["apiKey"]
    ) {
      authentic = true;
    }

    if (!authentic) {
      throw new AuthenticationError();
    }

    const updatedDetails = {
      publicKey: record.publicKey,
      message: record.message,
      dataLimit: record.dataLimit,
      dataUsed: record.dataUsed,
      apiKey: record.apiKey,
      encryptionPublicKey: encryptionPublicKey,
      accessToken: record.accessToken,
      tokenExpires: record.tokenExpires,
      faucet: record.faucet,
    };

    const _ = await updateUserDetails(updatedDetails);

    res.status(200).json("Success");
  } catch (error) {
    next(error);
  }
};
