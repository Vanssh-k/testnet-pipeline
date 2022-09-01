const SHA256 = require("crypto-js/sha256");
const userDetails = require("../repository/userDetails");
const verifySignature = require("../controller/authentication/verifySignature");
const Errors = require("../errors");
const helpers = require("../helpers");
const web3 = require("web3");
const checkApiKey = require("../repository/checkApiKey");

module.exports = (rules, clauses = []) => {
  return async (req, res, next) => {
    if (rules && rules.length) {
      rulesLoop: for (let rule of rules) {
        let record = {};
        ruleSwitch: switch (rule) {
          case "verifysignature":
            const usersPublicKey = req.body.publicKey || req.query.publicKey;
            record = await userDetails(usersPublicKey);
            if (!record) {
              return next(new Errors.NotFoundError());
            }
            let authentic = verifySignature(
              usersPublicKey,
              record.message,
              req.body.signedMessage
            );
            if (!authentic) {
              return next(new Errors.AuthenticationError());
            }
            req.user = record;
            break ruleSwitch;
          case "verifyjwt":
            if (clauses.includes("useSHA256WithApiKey")) {
              const apiKey = req.headers["authorization"].split(" ")[1];
              const record = await checkApiKey(SHA256(apiKey).toString());
              if (!record) {
                return next(new Errors.AuthenticationError());
              }
              req.user = record;
              break ruleSwitch;
            }
            let accessToken = req.headers["authorization"]?.split(" ")[1];
            if (clauses.includes("useSHA256WithAccessTokenAndApiKey")) {
              let publicKey =
                req.body.fromPublicKey ||
                req.query.publicKey ||
                req.body.publicKey;
              record = await userDetails(publicKey);
              if (!record) {
                return next(new Errors.NotFoundError());
              }
              let authentic = false;
              if (
                SHA256(accessToken).toString() === record["accessToken"] ||
                SHA256(accessToken).toString() === record["apiKey"]
              ) {
                authentic = true;
              }
              if (!authentic) {
                return next(new Errors.AuthenticationError());
              }
              break ruleSwitch;
            }
            let accessData = helpers.verifyJWT(
              accessToken,
              clauses.includes("useRefreshSecret")
                ? process.env.JWT_REFRESH_SECRET
                : process.env.JWT_SECRET
            );
            if (!accessData) {
              return next(new Errors.AuthenticationError());
            }
            record = await userDetails(accessData.publicKey);
            if (!record) {
              return next(new Errors.NotFoundError());
            }
            if (clauses.includes("useRefreshEquality")) {
              if (record.accessToken !== accessToken) {
                return next(new Errors.AuthenticationError());
              }
            }
            req.user = record;
            break ruleSwitch;
          case "verifypublickey":
            const publicKey = req.body.publicKey || req.query.publicKey;
            if (clauses.includes("useWeb3")) {
              if (!web3.utils.isAddress(publicKey)) {
                return next(new Errors.RequestValidationError([
                  { msg: "Invalid public key!!!" },
                ]));
              }
            }
            record = await userDetails(publicKey); // Check if user already exist
            if (!record) {
              return next(new Errors.NotFoundError());
            }
            if (clauses.includes("useEncryptionPublicKeyExists")) {
              if (!record.encryptionPublicKey) {
                return next(new Errors.NotFoundError());
              }
            }
            req.user = record;
            break ruleSwitch;
          default:
            continue rulesLoop;
        }
      }
      return next();
    }
    return next();
  };
};
