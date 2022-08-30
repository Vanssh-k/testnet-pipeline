const { checkSubdomain, getRecord } = require("./subdomain");
const updateSubDomain = require("./updateSubDomain");
const NotFoundError = require("../../errors/not-found-error");
const ForbiddenError = require("../../errors/forbidden");

exports.add_subdomain = async (req, res, next) => {
  try {
    const restrictedNames = ["api", "gateway", "testnet", "mainnet", "node"];
    if (restrictedNames.includes(req.body.subDomain)) {
      throw new ForbiddenError();
    }

    const publicKey = req.body.publicKey.toLowerCase();

    const transactionDetails = await getRecord(publicKey);
    if (transactionDetails.txHash) {
      transactionDetails.lastUpdate = Date.now();
      transactionDetails.subDomain = req.body.subDomain;

      const _ = await updateSubDomain(transactionDetails);

      res.status(200).json("SubDomain Created");
    } else {
      throw new ForbiddenError();
    }
  } catch (error) {
    next(error);
  }
};

exports.check_subdomain = async (req, res, next) => {
  try {
    const exists = await checkSubdomain(req.query.subDomain);
    if (!exists) {
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
    if (!record || !record.subDomain) {
      throw new NotFoundError();
    }
    res.status(200).json(record.subDomain);
  } catch (error) {
    next(error);
  }
};

exports.get_transaction_details = async (req, res, next) => {
  try {
    const record = await getRecord(req.query.publicKey);
    if (!record) {
      throw new NotFoundError();
    }
    res.status(200).json({
      network: record.network,
      subDomain: record.subDomain,
      txHash: record.txHash,
      value: record.value,
    });
  } catch (error) {
    next(error);
  }
};
