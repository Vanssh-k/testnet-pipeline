const express = require("express");
const AuthController = require("../controller/authentication");
const { body, query } = require("express-validator");

const router = express.Router();
const validate = require("../middlewares/validate");

router.post(
  "/verify_signer",
  [
    body("publicKey").trim().not().isEmpty().withMessage("publicKey not found"),
    body("signedMessage")
      .trim()
      .not()
      .isEmpty()
      .withMessage("signedMessage not found"),
  ],
  validate,
  AuthController.verify_signer
);

router.post(
  "/verify_signer_with_data",
  [
    body("publicKey").trim().not().isEmpty().withMessage("publicKey not found"),
    body("signedMessage")
      .trim()
      .not()
      .isEmpty()
      .withMessage("signedMessage not found"),
  ],
  validate,
  AuthController.verify_signer_with_data
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
    query("twitterID").not().isEmpty().withMessage("twitterID not found")
  ],
  validate,
  AuthController.tweet_recharge
);

router.get("/verify_api_key", AuthController.verify_api_key);

module.exports = router;
