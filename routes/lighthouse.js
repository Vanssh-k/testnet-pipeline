const express = require("express");
const router = express.Router();

const InfuraController = require("../controller/Infura");
const EstuaryController = require("../controller/estuary");
const ContractController = require("../controller/contract");
const AuthController = require("../controller/authentication");

router.post("/user_token", EstuaryController.user_token);
router.get("/get_ticker", EstuaryController.get_ticker);
router.get("/status/:cid", EstuaryController.status);
router.post("/add_cid", EstuaryController.add_cid);

router.get("/list_data", EstuaryController.list_data);
router.get("/get_deals", EstuaryController.get_deals);
router.get("/get_deals_filecoin", EstuaryController.get_deals_filecoin);

router.get("/get_uploads", ContractController.get_uploads);
router.get("/upload_client", InfuraController.upload_client);

router.get("/verify_signer", AuthController.verify_signer);
router.get("/get_message", AuthController.get_message);

module.exports = router;
