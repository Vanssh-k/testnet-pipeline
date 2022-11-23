const express = require('express');
const GatewayController = require('../controller/gateway');
const validate = require('../middlewares/validate');
const validator = require('../middlewares/validators');
const authenticator = require('../middlewares/authenticator');

const router = express.Router();

router.post(
  '/add_subdomain',
  validate(validator.addSubdomainSchema, { body: true }),
  authenticator(['verifysignature']),
  GatewayController.add_subdomain,
);

router.get(
  '/check_subdomain',
  validate(validator.subdomainSchema, { query: true }),
  GatewayController.check_subdomain,
);

router.get(
  '/get_subdomain',
  validate(validator.publicKeySchema, { query: true }),
  GatewayController.get_subdomain,
);

router.get(
  '/get_transaction_details',
  validate(validator.publicKeySchema, { query: true }),
  GatewayController.get_transaction_details,
);

router.get('/get_plans', GatewayController.get_purchaseable_plans);
router.get(
  '/get_active',
  GatewayController.get_active_plan,
);

module.exports = router;
