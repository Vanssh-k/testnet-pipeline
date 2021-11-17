const express = require('express');
const router = express.Router();
const EstuaryController = require('../controller/estuary/EstuaryController')

router.get("/user_token", EstuaryController.user_token);

module.exports = router;
