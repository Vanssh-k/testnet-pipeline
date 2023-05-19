import express from 'express'
import {
  get_ticker,
  deal_status,
  file_info,
  migration_request,
  migration_request_ent,
  list_migration_requests,
  migration_request_info,
} from '../controller/lighthouse'
import authenticator from '../middlewares/authenticator'
import validate from '../middlewares/validate'
import validator from '../middlewares/validators'

const router = express.Router()

router.get(
  '/get_ticker',
  validate(validator.symbolSchema, { query: true }),
  get_ticker
)

router.get(
  '/file_info',
  validate(validator.cidSchema, { query: true }),
  file_info
)

router.get(
  '/deal_status',
  validate(validator.cidSchema, { query: true }),
  deal_status
)

router.post(
  '/migration_request',
  validate(validator.migrationRequestSchema, { body: true }),
  authenticator(['verifysignature']),
  migration_request
)

router.post(
  '/migration_request_ent',
  validate(validator.migrationRequestEntSchema, { body: true }),
  authenticator(['enterpriseRoute']),
  migration_request_ent
)

router.get(
  '/list_migration_requests',
  validate(validator.publicKeySchema, { query: true }),
  list_migration_requests
)

router.get(
  '/migration_request_info',
  validate(validator.migrationRequestIdSchema, { query: true }),
  migration_request_info
)

export default router
