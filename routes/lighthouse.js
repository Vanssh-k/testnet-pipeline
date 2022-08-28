const express = require("express");
const LighthouseController = require("../controller/lighthouse");
const validate = require("../middlewares/validate");
const validator = require("../middlewares/validators");

const router = express.Router();

router.get(
  "/get_ticker",
  validate(validator.symbolSchema, { query: true }),
  LighthouseController.get_ticker
);

router.get(
  "/file_info",
  validate(validator.cidSchema, { query: true }),
  LighthouseController.file_info
);

router.get(
  "/cid_status",
  validate(validator.cidSchema, { query: true }),
  LighthouseController.cid_status
);

router.post(
  "/add_cid",
  validate(validator.addCidSchema, { body: true }),
  LighthouseController.add_cid
);

router.post(
  "/bulk_cid_add",
  validate(validator.bulkCidAddSchema, { body: true }),
  LighthouseController.bulk_cid_add
);

router.get(
  "/cid_order_status",
  validate(validator.publicKeySchema, { query: true }),
  LighthouseController.cid_order_status
);

router.get(
  "/order_details",
  validate(validator.orderIdSchema, { query: true }),
  LighthouseController.order_details
);

router.post(
  "/add_cid_to_queue",
  validate(validator.addCIDToQueueSchema, { body: true }),
  LighthouseController.add_cid_to_queue
);

module.exports = router;
