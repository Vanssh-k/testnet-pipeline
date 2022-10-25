const SHA256 = require("crypto-js/sha256");
const userDetails = require("../repository/userDetails");
const getMigrationRequestInfo = require("../repository/getMigrationRequestInfo");
const verifySignature = require("../utils/verifySignature");
const Errors = require("../errors");
const helpers = require("../helpers");
const getNetwork = require("./getNetwork");
const checkApiKey = require("../repository/checkApiKey");

module.exports = (rules, clauses = []) => {
  return async (req, res, next) => {
    if (rules && rules.length) {
      rulesLoop: for (let rule of rules) {
        let record = {};
        let network = null;
        ruleSwitch: switch (rule) {
          case "verifysignature":
            const usersPublicKey = req.body.publicKey || req.query.publicKey;
            network = getNetwork(usersPublicKey);
            record = await userDetails(usersPublicKey, network);
            if (!record) {
              return next(new Errors.NotFoundError());
            }
            let authentic = verifySignature(
              usersPublicKey,
              record.message,
              req.body.signedMessage,
              record.network
            );
            if (!authentic) {
              return next(new Errors.AuthenticationError());
            }
            req.user = record;
            break ruleSwitch;
          
          case "verifyjwt":
            if (clauses.includes("useSHA256WithApiKey")) {
              const apiKey = req.headers["authorization"]?.split(" ")[1];
              console.log(apiKey)
              if (!apiKey){
                return next(new Errors.AuthenticationError());
              }
              console.log(SHA256(apiKey).toString())
              const record = await checkApiKey(SHA256(apiKey).toString());
              console.log(record)
              if (!record) {
                return next(new Errors.AuthenticationError());
              }
              req.user = record;
              break ruleSwitch;
            }
            let accessToken = req.headers["authorization"]?.split(" ")[1];
            if (!accessToken){
              return next(new Errors.AuthenticationError());
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
            network = getNetwork(accessData.publicKey);
            record = await userDetails(accessData.publicKey);
            if (!record) {
              return next(new Errors.NotFoundError());
            }
            if (clauses.includes("useRefreshEquality")) {
              if (record.refreshToken !== SHA256(accessToken).toString()) {
                return next(new Errors.AuthenticationError());
              }
            }
            req.user = record;
            break ruleSwitch;
          
          case "verifypublickey":
            const publicKey = req.body.publicKey || req.query.publicKey;
            network = getNetwork(publicKey);
            if (clauses.includes("useWeb3")) {
              if (!network) {
                return next(new Errors.RequestValidationError([
                  { msg: "Invalid public key!!!" },
                ]));
              }
            }
            record = await userDetails(publicKey, network); // Check if user already exist
            if (!clauses.includes("useNewUserBypass")) {
              if (!record) {
                return next(new Errors.NotFoundError());
              }
            }
            if (clauses.includes("protectedRoute")) {
              const routeAccessToken = req.headers["authorization"]?.split(" ")[1];
              if(routeAccessToken !== process.env.ROUTE_ACCESS_TOKEN){
                return next(new Errors.ForbiddenError());
              }
            }
            req.user = record;
            req.network = network;
            break ruleSwitch;
          
          case "verifyMigrationRequest":
            const requestId = req.query.requestId;
            const requestInfo = await getMigrationRequestInfo(requestId);
            if (!requestInfo) {
              return next(new Errors.NotFoundError());
            }
            network = getNetwork(requestInfo["publicKey"]);
            record = await userDetails(requestInfo["publicKey"], network);
            if (!record) {
              return next(new Errors.NotFoundError());
            }
            req.info = requestInfo;
            req.user = record;
            break ruleSwitch;

          case "enterpriseRoute":
            const routeAccessToken = req.headers["authorization"]?.split(" ")[1];
            let verificationToken = null;
            if(req.body.enterprise==="ocean_protocol"){
              verificationToken = process.env.MIGRATION_OCEAN_ACCESS_TOKEN;
            }
            if (routeAccessToken!==verificationToken || !verificationToken) {
              return next(new Errors.NotFoundError());
            }
            req.network = getNetwork(req.body.publicKey);
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
