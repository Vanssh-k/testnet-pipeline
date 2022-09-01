const { checkSubdomain, getRecord, userTransactions } = require("../../repository/subdomain");
const updateSubDomain = require("../../repository/updateSubDomain");
const NotFoundError = require("../../errors/not-found-error");
const ForbiddenError = require("../../errors/forbidden");

exports.add_subdomain = async (req, res, next) => {
  try {
    // TODO apply check for special characters
    const restrictedNames = ["api", "gateway", "testnet", "mainnet", "node"];
    if (restrictedNames.includes(req.body.subDomain)) {
      throw new ForbiddenError();
    }

    const exists = await checkSubdomain(req.query.subDomain);
    if (exists) {
      throw new ForbiddenError();
    }

    const publicKey = req.body.publicKey.toLowerCase();

    const transactionDetails = await userTransactions(publicKey);

    // Temporary Solution, DB redesign required
    if(transactionDetails.length === 0) {
      throw new ForbiddenError("No plan purchased");
    }

    const subscriptionID = transactionDetails[0]["subscriptionID"];
    const timestamp = Date.now();

    const _ = await updateSubDomain({
      publicKey: publicKey,
      subDomain: req.body.subDomain,
      subscriptionID: subscriptionID,
      createdAt: timestamp,
      updatedAt: timestamp
    });

    res.status(200).json("SubDomain Created");
    
  } catch (error) {
    next(error);
  }
};

exports.check_subdomain = async (req, res, next) => {
  try {
    const restrictedNames = ["api", "gateway", "testnet", "mainnet", "node"];
    if (restrictedNames.includes(req.body.subDomain)) {
      throw new ForbiddenError();
    }
    
    const exists = await checkSubdomain(req.query.subDomain);
    if (!exists) {
      throw new NotFoundError();
    }
    res.status(200).json("Exists");
  } catch (error) {
    next(error);
  }
};

exports.get_subdomain = async (req, res, next) =>{
  try {
    const record = await getRecord(req.query.publicKey);
    if (!record) {
      throw new NotFoundError();
    }

    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
}

exports.get_transaction_details = async (req, res, next) => {
  try {
    const record = await userTransactions(req.query.publicKey);
    if (!record) {
      throw new NotFoundError();
    }

    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
};
