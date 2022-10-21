const express = require("express");
const LighthouseController = require("../controller/lighthouse");
const authenticator = require("../middlewares/authenticator");
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
  "/migration_request",
  validate(validator.migrationRequestSchema, { body: true }),
  authenticator(["verifysignature"]),
  LighthouseController.migration_request
);

router.get(
  "/list_migration_requests",
  validate(validator.publicKeySchema, { query: true }),
  LighthouseController.list_migration_requests
);

router.get(
  "/migration_request_info",
  validate(validator.migrationRequestIdSchema, { query: true }),
  LighthouseController.migration_request_info
);

router.post(
  "/add_cid_to_queue",
  validate(validator.addCIDToQueueSchema, { body: true }),
  authenticator(["verifypublickey"], ["protectedRoute"]),
  LighthouseController.add_cid_to_queue
);

module.exports = router;
