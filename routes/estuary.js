const express = require("express");
const router = express.Router();
const EstuaryController = require("../controller/estuary/EstuaryController");

router.post("/user_token", EstuaryController.user_token);
router.get("/status/:cid", EstuaryController.status);
router.get("/list_data", EstuaryController.list_data);
router.get("/get_deals_filecoin", EstuaryController.get_deals_filecoin);
router.get("/get_deals", EstuaryController.get_deals);
router.post("/get_quote", EstuaryController.get_quote);
router.post("/push_cid_tochain", EstuaryController.push_cid_tochain);
router.get("/check_address", EstuaryController.check_address);

module.exports = router;
