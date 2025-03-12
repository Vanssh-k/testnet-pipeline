import express from 'express'
import {
  get_ticker,
  deal_status,
  file_info,
  pin_cid,
  migration_request,
  cid_pin_status,
  list_migration_requests,
  migration_request_info,
  retry_migration,
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
  authenticator('verifyToken'),
  migration_request,
)

router.post('/pin', validate(validator.pinningSchema, { body: true }), authenticator('verifyToken'), pin_cid)

router.get(
  '/retry_migration',
  validate(validator.migrationRequestIdSchema, { query: true }),
  // authenticator('verifyToken'),
  retry_migration,
)

router.get('/list_migration_requests', validate(validator.publicKeySchema, { query: true }), list_migration_requests)

router.get('/cid_pin_status', validate(validator.pinningStatusSchema, { query: true }), cid_pin_status)

router.get(
  '/migration_request_info',
  validate(validator.migrationRequestIdSchema, { query: true }),
  migration_request_info,
)

// Filecoin
router.get('/deal_status', validate(validator.cidSchema, { query: true }), deal_status)

export default router
