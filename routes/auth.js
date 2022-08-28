const express = require("express");
const AuthController = require("../controller/authentication");
const { body, query } = require("express-validator");
const validator = require("../middlewares/validators");
const validate = require("../middlewares/validate");

const router = express.Router();

router.post(
  "/verify_signer",
  validate(validator.verifySignerSchema, { body: true }),
  AuthController.verify_signer
);

router.get(
  "/verify_access_token",
  validate,
  AuthController.verify_access_token
);

router.get(
  "/refresh_access_token",
  validate,
  AuthController.refresh_access_token
);

router.get(
  "/get_message",
  [query("publicKey").not().isEmpty().withMessage("publicKey not found")],
  validate,
  AuthController.get_message
);

router.post(
  "/get_api_key",
  [
    body("publicKey").trim().not().isEmpty().withMessage("publicKey not found"),
    body("signedMessage")
      .trim()
      .not()
      .isEmpty()
      .withMessage("signedMessage not found"),
  ],
  validate,
  AuthController.get_api_key
);

router.get(
  "/tweet_recharge",
  [
    query("publicKey").not().isEmpty().withMessage("publicKey not found"),
    query("twitterID").not().isEmpty().withMessage("twitterID not found"),
  ],
  validate,
  AuthController.tweet_recharge
);

router.get("/verify_api_key", AuthController.verify_api_key);

router.post(
  "/save_encryption_publicKey",
  [
    body("publicKey").trim().not().isEmpty().withMessage("publicKey not found"),
    body("encryptionPublicKey")
      .trim()
      .not()
      .isEmpty()
      .withMessage("subDomain not found"),
  ],
  validate,
  AuthController.save_encryption_publicKey
);

module.exports = router;
