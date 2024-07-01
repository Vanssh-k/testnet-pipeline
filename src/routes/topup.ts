import express from 'express'
import {
  record_transaction,
  create_subdomain,
  check_subdomain,
  get_active_plan_list,
  get_subdomain,
  get_user_transactions,
  plan_details_by_id,
  create_stripe_order,
  verify_and_update,
} from '../controller/topup/index.js'
import validate from '../middlewares/validate.js'
import validator from '../middlewares/validators/index.js'
import authenticator from '../middlewares/authenticator.js'

const router = express.Router()

router.post(
  '/record_transaction',
  validate(validator.recordTransactionSchema, { body: true }),
  authenticator('transactionProtectRoute'),
  record_transaction,
)

router.post(
  '/create_subdomain',
  validate(validator.addSubdomainSchema, { body: true }),
  authenticator('verifysignature'),
  create_subdomain,
)

router.get('/check_subdomain', validate(validator.subdomainSchema, { query: true }), check_subdomain)

router.get('/get_subdomain', validate(validator.publicKeySchema, { query: true }), get_subdomain)

router.get('/plan_details_by_id', validate(validator.subscriptionIdSchema, { query: true }), plan_details_by_id)

router.get('/get_user_transactions', authenticator('verifyToken', ['publicKeyOnly']), get_user_transactions)

router.get('/get_active_plan_list', get_active_plan_list)

router.get(
  '/purchase_plan_via_stripe',
  validate(validator.subscriptionIdSchema, { query: true }),
  authenticator('verifyToken'),
  create_stripe_order,
)
router.post(
  '/purchase_plan_via_coreum',
  validate(validator.subscriptionIdSchema, { query: true }),
  authenticator('verifyToken'),
  verify_and_update,
)

export default router
