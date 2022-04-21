const verifySignature = require("../authentication/verifySignature");
const checkApiKey = require("../authentication/checkApiKey");

const { checkSubdomain, getRecord } = require("./subdomain");
const updateSubDomain = require("./updateSubDomain");

const DatabaseError = require("../../errors/database-error");
const AuthenticationError = require("../../errors/authentication-error");
const NotFoundError = require("../../errors/not-found-error");
const ForbiddenError = require("../../errors/forbidden");

exports.add_subdomain = async (req, res, next) => {
  try {
    const restrictedNames = ["api", "gateway", "testnet", "mainnet", "node"];
    if(restrictedNames.includes(req.body.subDomain)){
      throw new ForbiddenError();
    }

    let verified = false;
    const publicKey = req.body.publicKey.toLowerCase();
    if (req.body.signedMessage) {
      verified = await verifySignature(publicKey, req.body.signedMessage);
    } else {
      verified = await checkApiKey(req.body.apiKey);
    }

    if (!verified) {
      throw new AuthenticationError();
    }

    const transactionDetails = await getRecord(publicKey);
    if (
      transactionDetails.txHash &&
      transactionDetails.publicKey.toLowerCase() === publicKey
    ) {
      transactionDetails.lastUpdate = Date.now();
      transactionDetails.subDomain = req.body.subDomain;

      const updateResponse = await updateSubDomain(transactionDetails);
      if (updateResponse === null) {
        throw new DatabaseError("Put item failed");
      }
      
      res.status(200).json("SubDomain Created");
    } else {
      throw new AuthenticationError();
    }
  } catch (error) {
    next(error)
  }
};

exports.check_subdomain = async (req, res, next) => {
  try {
    const exists = await checkSubdomain(req.query.subDomain);
    console.log(exists)
    if(!exists){
      throw new NotFoundError();
    }
    res.status(200).json("Exists");
  } catch (error) {
    next(error);
  }
};

exports.get_subdomain = async (req, res, next) => {
  try {
    const record = await getRecord(req.query.publicKey);
    if(record === null || record.subDomain === null){
      throw new NotFoundError();
    }
    res.status(200).json(record.subDomain);
  } catch (error) {
    next(error)
  }
};

exports.get_transaction_details = async (req, res, next) => {
  try {
    const record = await getRecord(req.query.publicKey);
    if(!record){
      throw new NotFoundError();
    }
    res.status(200).json({
      network: record.network,
      subDomain: record.subDomain,
      txHash: record.txHash,
      value: record.value
    });
  } catch (error) {
    next(error)
  }
};
