const express = require("express");
const router = express.Router();
const EstuaryController = require("../controller/estuary/EstuaryController");

router.get("/user_token", EstuaryController.user_token);
router.get("/metadata_by_cid/:cid", EstuaryController.metadata_by_cid);
router.get("/list_data", EstuaryController.list_data);
router.get("/get_deals_filecoin", EstuaryController.get_deals_filecoin);
router.get("/get_deals", EstuaryController.get_deals);

module.exports = router;
