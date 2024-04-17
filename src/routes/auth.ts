import express from 'express'
import {
  verify_api_key,
  verify_signer,
  get_message,
  remove_api_key,
  create_api_key,
  get_user_keys,
  get_profile,
} from '../controller/authentication/index.js'
import validator from '../middlewares/validators/index.js'
import validate from '../middlewares/validate.js'
import authenticator from '../middlewares/authenticator.js'

const router = express.Router()

router.get('/get_auth_message', validate(validator.messageSchema, { query: true }), get_message)

router.get('/get_profile', authenticator('verifyToken'), get_profile)

router.post(
  '/verify_signer',
  validate(validator.verifySignerSchema, { body: true }),
  authenticator('verifysignature'),
  verify_signer,
)

router.post(
  '/create_api_key',
  validate(validator.apiKeyName, { query: true }),
  authenticator('verifysignature'),
  create_api_key,
)

router.get(
  '/create_api_key',
  validate(validator.apiKeyName, { query: true }),
  authenticator('verifyToken', ['publicKeyOnly']),
  create_api_key,
)

router.get('/verify_api_key', authenticator('verifyToken'), verify_api_key)

router.get('/get_user_keys', authenticator('verifyToken', ['publicKeyOnly']), get_user_keys)

router.delete(
  '/remove_api_key',
  validate(validator.apiKeyIdSchema, { query: true }),
  authenticator('verifyToken', ['publicKeyOnly']),
  remove_api_key,
)

// Depreciated
router.get('/get_message', validate(validator.messageSchema, { query: true }), get_message)

export default router
