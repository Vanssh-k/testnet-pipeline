const SHA256 = require("crypto-js/sha256");
const { v4: uuidv4 } = require("uuid");

const userDetails = require("./userDetails");
const checkApiKey = require("./checkApiKey");
const verifySignature = require("./verifySignature");
const updateUserDetails = require("./updateUserDetails");
const { freeDataLimitInBytes } = require("../libs/constants");

const DatabaseError = require("../../errors/database-error");
const AuthenticationError = require("../../errors/authentication-error");
const NotFoundError = require("../../errors/not-found-error");

// Return if user is authentic
exports.verify_signer = async (req, res, next) => {
  try {
    const usersPublicKey = req.body.publicKey;
    const signedMessage = req.body.signedMessage;
    const user = await userDetails(usersPublicKey);
    const authentic = verifySignature(
      usersPublicKey,
      user.message,
      signedMessage
    );

    if (!authentic) {
      throw new AuthenticationError();
    }
    res.status(200).json("Authorized");
  } catch (error) {
    next(error);
  }
};

// Return if user is authentic along with his data usage
exports.verify_signer_with_data = async (req, res, next) => {
  try {
    const usersPublicKey = req.body.publicKey;
    const signedMessage = req.body.signedMessage;

    const user = await userDetails(usersPublicKey);
    const authentic = verifySignature(
      usersPublicKey,
      user.message,
      signedMessage
    );

    if (!authentic) {
      throw new AuthenticationError();
    }
    res.status(200).json({
      dataLimit: user.dataLimit,
      dataUsed: user.dataUsed,
    });
  } catch (error) {
    next(error);
  }
};

// Get message - user will sign this message to verify himself
exports.get_message = async (req, res, next) => {
  try {
    const publicKey = req.query.publicKey;
    const record = await userDetails(publicKey); // Check if user already exist
    const message = uuidv4().toString();

    const updatedDetails = {
      publicKey: publicKey,
      message: message,
      dataLimit: record ? record.dataLimit : freeDataLimitInBytes,
      dataUsed: record ? record.dataUsed : 0,
      apiKey: record ? record.apiKey : null,
    };

    const updateResponse = await updateUserDetails(updatedDetails);
    if (updateResponse === null) {
      throw new DatabaseError("Put item failed");
    }

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

    if (record === null) {
      throw new NotFoundError();
    }

    const authentic = verifySignature(
      usersPublicKey,
      record["message"],
      signedMessage
    );

    if (!authentic) {
      throw new AuthenticationError();
    }

    const apiKey = uuidv4().toString();
    const updatedDetails = {
      publicKey: record.publicKey,
      message: record.message,
      dataLimit: record.dataLimit,
      dataUsed: record.dataUsed,
      apiKey: SHA256(apiKey).toString(),
    };

    const updateResponse = await updateUserDetails(updatedDetails);
    if (updateResponse === null) {
      throw new DatabaseError("Put item failed");
    }

    res.status(200).json(apiKey);
  } catch (error) {
    next(error);
  }
};

exports.verify_api_key = async (req, res) => {
  const record = await checkApiKey(SHA256(req.query.apiKey).toString());
  if (record) {
    res.status(200).json({
      publicKey: record.publicKey,
      dataLimit: record.dataLimit,
      dataUsed: record.dataUsed,
    });
  } else {
    res.status(401).json("UnAuthorized");
  }
};
