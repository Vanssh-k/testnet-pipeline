const express = require("express");
const AuthController = require("../controller/authentication");
const validator = require("../middlewares/validators");
const validate = require("../middlewares/validate");

const router = express.Router();

router.post(
  "/verify_signer",
  validate(validator.verifySignerSchema, { body: true }),
  AuthController.verify_signer
);

router.get("/verify_access_token", AuthController.verify_access_token);

router.get("/refresh_access_token", AuthController.refresh_access_token);

router.get(
  "/get_message",
  validate(validator.publicKeySchema, { query: true }),
  AuthController.get_message
);

router.post(
  "/get_api_key",
  validate(validator.verifySignerSchema, { body: true }),
  AuthController.get_api_key
);

router.get(
  "/tweet_recharge",
  validate(validator.tweetRechargeSchema, { query: true }),
  AuthController.tweet_recharge
);

router.get("/verify_api_key", AuthController.verify_api_key);

router.post(
  "/save_encryption_publicKey",
  validate(validator.saveEncryptionPublicKeySchema, { body: true }),
  AuthController.save_encryption_publicKey
);

module.exports = router;
