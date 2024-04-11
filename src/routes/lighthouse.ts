import express from 'express'
import {
  get_ticker,
  deal_status,
  deal_id,
  file_info,
  get_proof,
  aggregate_info,
  bundle_details,
  pin_cid,
  migration_request,
  migration_request_ent,
  cid_pin_status,
  list_migration_requests,
  migration_request_info,
  file_info_testnet,
  raas_info,
} from '../controller/lighthouse/index.js'
import authenticator from '../middlewares/authenticator.js'
import validate from '../middlewares/validate.js'
import validator from '../middlewares/validators/index.js'

const router = express.Router()

router.get('/get_ticker', validate(validator.symbolSchema, { query: true }), get_ticker)

router.get('/file_info', validate(validator.cidSchema, { query: true }), file_info)

router.post(
  '/migration_request',
  validate(validator.migrationRequestSchema, { body: true }),
  authenticator('verifyToken', ['publicKeyOnly']),
  migration_request,
)

router.post(
  '/pin',
  validate(validator.pinningSchema, { body: true }),
  authenticator('verifyToken', ['publicKeyOnly']),
  pin_cid,
)

router.post(
  '/migration_request_ent',
  validate(validator.migrationRequestEntSchema, { body: true }),
  authenticator('enterpriseRoute'),
  migration_request_ent,
)

router.get('/list_migration_requests', validate(validator.publicKeySchema, { query: true }), list_migration_requests)

router.get('/cid_pin_status', validate(validator.cidSchema, { query: true }), cid_pin_status)

router.get(
  '/migration_request_info',
  validate(validator.migrationRequestIdSchema, { query: true }),
  migration_request_info,
)

// Filecoin
router.get(
  '/file_info_testnet',
  // validate(validator.cidSchema, { query: true }),
  file_info_testnet,
)

router.get(
  '/raas_info',
  // validate(validator.cidSchema, { query: true }),
  raas_info,
)

router.get('/deal_status', validate(validator.cidSchema, { query: true }), deal_status)

router.get('/deal_id', deal_id)

router.get('/bundle_details', validate(validator.bundleSchema, { query: true }), bundle_details)

router.get('/get_proof', get_proof)

router.get('/aggregate_info', aggregate_info)

export default router
