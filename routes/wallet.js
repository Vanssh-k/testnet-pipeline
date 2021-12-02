const express = require('express');
const router = express.Router();
const WalletController = require('../controller/wallet/WalletController');

router.post("/create_wallet", WalletController.create_wallet);
router.post("/get_balance", WalletController.get_balance);

module.exports = router;
