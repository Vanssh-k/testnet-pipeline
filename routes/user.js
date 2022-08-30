const express = require("express");
const UserController = require("../controller/user");
const authenticator = require("../middlewares/authenticator");
const validate = require("../middlewares/validate");
const validator = require("../middlewares/validators");

const router = express.Router();

router.get(
  "/get_uploads",
  validate(validator.publicKeySchema, { query: true }),
  UserController.get_uploads
);

router.get(
  "/user_data_usage",
  validate(validator.publicKeySchema, { query: true }),
  authenticator(["verifypublickey"]),
  UserController.user_data_usage
);

router.get(
  "/faucet_status",
  authenticator(["verifyjwt"]),
  UserController.faucet_status
);

module.exports = router;
