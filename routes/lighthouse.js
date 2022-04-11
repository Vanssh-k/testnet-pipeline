const express = require("express");
const LighthouseController = require("../controller/lighthouse");
const { body, query } = require("express-validator");

const router = express.Router();
const validate = require('../middlewares/validate');

router.get("/get_ticker", [
  query('symbol').not().isEmpty().withMessage("token symbol not found"),
], validate, LighthouseController.get_ticker);

router.get("/cid_status", [
  query('cid').not().isEmpty().withMessage("cid not found"),
], validate, LighthouseController.cid_status);

router.post("/add_cid", [
  body("name").trim().not().isEmpty().withMessage("file name not found"),
  body("cid").trim().not().isEmpty().withMessage("cid not found"),
], validate, LighthouseController.add_cid);

router.post("/add_cid_to_queue", [
  body("publicKey").trim().not().isEmpty().withMessage("publicKey not found"),
  body("name").trim().not().isEmpty().withMessage("file name not found"),
  body("cid").trim().not().isEmpty().withMessage("cid not found"),
  body("size").trim().not().isEmpty().withMessage("file size not found"),
], validate, LighthouseController.add_cid_to_queue);

module.exports = router;
