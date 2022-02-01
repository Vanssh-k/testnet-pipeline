const express = require("express");
const router = express.Router();
const EstuaryController = require("../controller/estuary/EstuaryController");
const InfuraController = require("../controller/Infura");
const ContractController = require("../controller/contract");

router.post("/user_token", EstuaryController.user_token);
router.get("/status/:cid", EstuaryController.status);
router.get("/list_data", EstuaryController.list_data);
router.get("/get_deals", EstuaryController.get_deals);
router.post("/get_quote", EstuaryController.get_quote);
router.post("/add_cid", EstuaryController.add_cid);
router.get("/get_deals_filecoin", EstuaryController.get_deals_filecoin);

router.get("/upload_client", InfuraController.upload_client);
router.post("/user_cid", ContractController.user_cid);

module.exports = router;
