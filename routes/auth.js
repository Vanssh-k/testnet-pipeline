const express = require('express');
const AuthController = require('../controller/authentication');
const validator = require('../middlewares/validators');
const validate = require('../middlewares/validate');
const authenticator = require('../middlewares/authenticator');

const router = express.Router();

router.post(
  '/verify_signer',
  validate(validator.verifySignerSchema, { body: true }),
  authenticator(['verifysignature']),
  AuthController.verify_signer,
);

router.get(
  '/verify_access_token',
  authenticator(['verifyjwt']),
  AuthController.verify_access_token,
);

router.get(
  '/refresh_access_token',
  authenticator(['verifyjwt'], ['useRefreshSecret', 'useRefreshEquality']),
  AuthController.refresh_access_token,
);

router.delete(
  '/remove_refresh_token',
  authenticator(['verifyjwt'], ['useRefreshSecret', 'useRefreshEquality']),
  AuthController.remove_refresh_token,
);

router.get(
  '/get_message',
  validate(validator.publicKeySchema, { query: true }),
  authenticator(['verifypublickey'], ['useWeb3', 'useNewUserBypass']),
  AuthController.get_message,
);

router.post(
  '/get_api_key',
  validate(validator.verifySignerSchema, { body: true }),
  authenticator(['verifysignature']),
  AuthController.get_api_key,
);

router.get(
  '/tweet_recharge',
  validate(validator.tweetRechargeSchema, { query: true }),
  authenticator(['verifyjwt']),
  AuthController.tweet_recharge,
);

router.get(
  '/verify_api_key',
  authenticator(['verifyjwt'], ['useSHA256WithApiKey']),
  AuthController.verify_api_key,
);

module.exports = router;
