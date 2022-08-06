const express = require("express");
const LighthouseController = require("../controller/lighthouse");
const { body, query } = require("express-validator");

const router = express.Router();
const validate = require("../middlewares/validate");

router.get(
  "/get_ticker",
  [query("symbol").not().isEmpty().withMessage("token symbol not found")],
  validate,
  LighthouseController.get_ticker
);

router.get(
  "/file_info",
  [query("cid").not().isEmpty().withMessage("cid not found")],
  validate,
  LighthouseController.file_info
);

router.get(
  "/cid_status",
  [query("cid").not().isEmpty().withMessage("cid not found")],
  validate,
  LighthouseController.cid_status
);

router.post(
  "/add_cid",
  [
    body("name").trim().not().isEmpty().withMessage("file name not found"),
    body("cid").trim().not().isEmpty().withMessage("cid not found"),
  ],
  validate,
  LighthouseController.add_cid
);

router.post(
  "/bulk_cid_add",
  [
    body("publicKey").trim().not().isEmpty().withMessage("publicKey not found"),
    body("signedMessage")
      .trim()
      .not()
      .isEmpty()
      .withMessage("signedMessage not found"),
      body("data").trim().not().isEmpty().withMessage("data not found"),
  ],
  validate,
  LighthouseController.bulk_cid_add
);

router.get(
  "/cid_order_status",
  [query("publicKey").not().isEmpty().withMessage("publicKey not found")],
  validate,
  LighthouseController.cid_order_status
);

router.get(
  "/order_details",
  [query("orderId").not().isEmpty().withMessage("orderId not found")],
  validate,
  LighthouseController.order_details
);

router.post(
  "/add_cid_to_queue",
  [
    body("publicKey").trim().not().isEmpty().withMessage("publicKey not found"),
    body("name").trim().not().isEmpty().withMessage("file name not found"),
    body("cid").trim().not().isEmpty().withMessage("cid not found"),
    body("size").trim().not().isEmpty().withMessage("file size not found"),
  ],
  validate,
  LighthouseController.add_cid_to_queue
);

module.exports = router;
