const {
  checkSubdomain,
  getRecord,
  userTransactions,
  purchasedPlans,
} = require("../../repository/subdomain");
const updateSubDomain = require("../../repository/updateSubDomain");
const NotFoundError = require("../../errors/not-found-error");
const ForbiddenError = require("../../errors/forbidden");
const { getSubscriptionStatus } = require("../../services/blockchain/billing");

const restrictedNames = [
  "api",
  "gateway",
  "testnet",
  "mainnet",
  "node",
  "encryption",
];
exports.add_subdomain = async (req, res, next) => {
  try {
    if (
      restrictedNames.includes(req.body.subDomain) ||
      !/[^A-Za-z0-9]/.test(req.body.subDomain)
    ) {
      throw new ForbiddenError();
    }

    const exists = await checkSubdomain(req.query.subDomain);
    if (exists) {
      throw new ForbiddenError();
    }

    const publicKey = req.body.publicKey.toLowerCase();

    const { status, subscriptionId } = await getSubscriptionStatus(publicKey);

    // const transactionDetails = await userTransactions(publicKey);

    // // Temporary Solution, DB redesign required
    // if (transactionDetails.length === 0) {
    //   throw new ForbiddenError("No plan purchased");
    // }

    if (!status) {
      if (subscriptionId > Number.MAX_SAFE_INTEGER) {
        return res
          .status(401)
          .json({ data: { message: "kindly purchase an active plan" } });
      } else {
        //TODO: Replace message with plan details
        // throw new ForbiddenError();
        return res.status(401).json({
          data: {
            message: `kindly renew or upgrade your plan subscriptionId: ${subscriptionId.toString()}`,
          },
        });
      }
    }
    const timestamp = Date.now();

    const _ = await updateSubDomain({
      publicKey: publicKey,
      subDomain: req.body.subDomain,
      subscriptionID: subscriptionId.toString(),
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    res.status(200).json("SubDomain Created");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.check_subdomain = async (req, res, next) => {
  try {
    if (
      restrictedNames.includes(req.body.subDomain) ||
      !/[^A-Za-z0-9]/.test(req.body.subDomain)
    ) {
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

exports.get_subdomain = async (req, res, next) => {
  try {
    const record = await getRecord(req.query.publicKey);
    if (!record) {
      throw new NotFoundError();
    }

    res.status(200).json(record["subDomain"]);
  } catch (error) {
    next(error);
  }
};

exports.get_transaction_details = async (req, res, next) => {
  try {
    const record = await userTransactions(req.query.publicKey);
    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
};

exports.get_purchaseable_plans = async (req, res, next) => {
  try {
    const record = await purchasedPlans();
    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
};

exports.get_active_plan = async (req, res, next) => {
  try {
    const publicKey = req.body.publicKey.toLowerCase();

    const { status, subscriptionId } = await getSubscriptionStatus(publicKey);

    if (!status) {
      if (subscriptionId > Number.MAX_SAFE_INTEGER) {
        return res
          .status(401)
          .json({ data: { message: "kindly purchase an active plan" } });
      } else {
        //TODO: Replace message with plan details
        // throw new ForbiddenError();
        return res.status(401).json({
          data: {
            message: `kindly renew or upgrade your plan subscriptionId: ${subscriptionId.toString()}`,
          },
        });
      }
    }
    res
      .status(200)
      .json({ data: { status, subscriptionId: subscriptionId.toString() } });
  } catch (error) {
    next(error);
  }
};
