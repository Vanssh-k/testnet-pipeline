const express = require("express");
const UserController = require("../controller/user");
const { query } = require("express-validator");

const router = express.Router();
const validate = require("../middlewares/validate");

router.get(
  "/get_uploads",
  [query("publicKey").not().isEmpty().withMessage("publicKey not found")],
  validate,
  UserController.get_uploads
);

router.get(
  "/user_data_usage",
  [query("publicKey").not().isEmpty().withMessage("publicKey not found")],
  validate,
  UserController.user_data_usage
);

module.exports = router;
