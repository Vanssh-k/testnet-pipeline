import express from 'express'
import {
  verify_access_token,
  verify_api_key,
  verify_signer,
  refresh_access_token,
  get_message,
  remove_api_key,
  create_api_key,
  get_user_keys,
} from '../controller/authentication'
import validator from '../middlewares/validators'
import validate from '../middlewares/validate'
import authenticator from '../middlewares/authenticator'

const router = express.Router()

router.get(
  '/get_auth_message',
  validate(validator.messageSchema, { query: true }),
  authenticator(['verifypublickey'], ['useWeb3', 'useNewUserBypass']),
  get_message
)

router.post(
  '/verify_signer',
  validate(validator.verifySignerSchema, { body: true }),
  authenticator(['verifysignature']),
  verify_signer
)

router.get(
  '/verify_access_token',
  authenticator(['verifyToken']),
  verify_access_token
)

router.get(
  '/refresh_access_token',
  authenticator(['verifyToken'], ['useRefreshSecret']),
  refresh_access_token
)

router.post(
  '/get_api_key',
  validate(validator.verifySignerSchema, { body: true }),
  authenticator(['verifysignature']),
  create_api_key
)

router.post(
  '/create_api_key',
  authenticator(['verifyToken'], ['publicKeyOnly']),
  create_api_key
)

router.get('/verify_api_key', authenticator(['verifyToken']), verify_api_key)

router.get(
  '/get_user_keys',
  authenticator(['verifyToken'], ['publicKeyOnly']),
  get_user_keys
)

router.delete(
  '/remove_api_key',
  validate(validator.apiKeyIdSchema, { query: true }),
  authenticator(['verifyToken'], ['publicKeyOnly']),
  remove_api_key
)

// Depreciated
router.get(
  '/get_message',
  validate(validator.messageSchema, { query: true }),
  authenticator(['verifypublickey'], ['useWeb3', 'useNewUserBypass']),
  get_message
)

export default router
