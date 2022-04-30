const express = require("express");
const GatewayController = require("../controller/gateway");
const { body, query, oneOf } = require("express-validator");

const router = express.Router();
const validate = require("../middlewares/validate");

router.post(
  "/add_subdomain",
  [
    body("publicKey").trim().not().isEmpty().withMessage("publicKey not found"),
    body("subDomain").trim().not().isEmpty().withMessage("subDomain not found"),
    body("signedMessage").trim().not().isEmpty().withMessage("signedMessage not found"),
  ],
  validate,
  GatewayController.add_subdomain
);

router.get(
  "/check_subdomain",
  [query("subDomain").not().isEmpty().withMessage("subDomain not found")],
  validate,
  GatewayController.check_subdomain
);

router.get(
  "/get_subdomain",
  [query("publicKey").not().isEmpty().withMessage("publicKey not found")],
  validate,
  GatewayController.get_subdomain
);

router.get(
  "/get_transaction_details",
  [query("publicKey").not().isEmpty().withMessage("publicKey not found")],
  validate,
  GatewayController.get_transaction_details
);

module.exports = router;
