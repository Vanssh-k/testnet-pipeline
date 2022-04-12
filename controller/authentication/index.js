const SHA256 = require("crypto-js/sha256");
const { v4: uuidv4 } = require("uuid");

const userDetails = require("./userDetails");
const checkApiKey = require("./checkApiKey");
const verifySignature = require("./verifySignature");
const updateUserDetails = require("./updateUserDetails");
const { freeDataLimitInBytes } = require("../libs/constants");

// Return if user is authentic
exports.verify_signer = async (req, res) => {
  try {
    const usersPublicKey = req.body.publicKey;
    const signedMessage = req.body.signedMessage;
    const user = await userDetails(usersPublicKey);
    const authentic = verifySignature(
      usersPublicKey,
      user.message,
      signedMessage
    );

    if(authentic){
      res.status(200).json("Authorized");
    } else {
      res.status(401).json("UnAuthorized");
    }
  } catch (e) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

// Return if user is authentic along with his data usage
exports.verify_signer_with_data = async (req, res) => {
  try {
    const usersPublicKey = req.body.publicKey;
    const signedMessage = req.body.signedMessage;
    
    const user = await userDetails(usersPublicKey);
    const authentic = verifySignature(
      usersPublicKey,
      user.message,
      signedMessage
    );

    if(authentic){
      res.status(200).json({
        dataLimit: user.dataLimit,
        dataUsed: user.dataUsed,
      })
    } else {
      res.status(401).json("UnAuthorized");
    }
  } catch (e) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

// Get message - user will sign this message to verify himself
exports.get_message = async (req, res) => {
  try {
    const publicKey = req.query.publicKey;
    const record = await userDetails(publicKey);        // Check if user already exist
    const message = uuidv4().toString();

    const updatedDetails = {
      publicKey: publicKey,
      message: message,
      dataLimit: record ? record.dataLimit : freeDataLimitInBytes,
      dataUsed: record ? record.dataUsed : 0,
      apiKey: record ? record.apiKey : null,
    };
    
    const updateResponse = await updateUserDetails(updatedDetails);
    res.status(200).json(message);
  } catch (e) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

exports.get_api_key = async (req, res) => {
  const usersPublicKey = req.body.publicKey;
  const signedMessage = req.body.signedMessage;
  const record = await userDetails(usersPublicKey);
  if (record) {
    const authentic = verifySignature(
      usersPublicKey,
      record["message"],
      signedMessage
    );
    
    if (authentic) {
      const apiKey = uuidv4().toString();
      const updatedDetails = {
        publicKey: record.publicKey,
        message: record.message,
        dataLimit: record.dataLimit,
        dataUsed: record.dataUsed,
        apiKey: SHA256(apiKey).toString(),
      };

      const updateResponse = await updateUserDetails(updatedDetails);
      if(updateResponse==="Update Successful"){
        res.status(200).json(apiKey);
      } else{
        res.status(500).json("Internal Server Error!!!");
      }
    } else {
      res.status(401).json("UnAuthorized");
    }
  } else {
    res.status(401).json("UnAuthorized");
  }
};

exports.verify_api_key = async (req, res) => {
  try{
    const apiKey = req.headers["authorization"].split(" ")[1];
    const record = await checkApiKey(SHA256(apiKey).toString());
    if (record) {
      res.status(200).json({
        publicKey: record.publicKey,
        dataLimit: record.dataLimit,
        dataUsed: record.dataUsed,
      });
    } else {
      res.status(401).json("UnAuthorized");
    }
  } catch{
    res.status(401).json("UnAuthorized");
  }
};
