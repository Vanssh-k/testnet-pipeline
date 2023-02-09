const express = require('express')
const TopupController = require('../controller/topup')
const validate = require('../middlewares/validate')
const validator = require('../middlewares/validators')
const authenticator = require('../middlewares/authenticator')

const router = express.Router()

router.post(
    '/record_transaction',
    validate(validator.recordTransactionSchema, { body: true }),
    authenticator(['transactionProtectRoute']),
    TopupController.record_transaction
)

router.post(
    '/create_subdomain',
    validate(validator.addSubdomainSchema, { body: true }),
    authenticator(['verifysignature']),
    TopupController.create_subdomain
)

router.get(
    '/check_subdomain',
    validate(validator.subdomainSchema, { query: true }),
    TopupController.check_subdomain
)

router.get(
    '/get_subdomain',
    validate(validator.publicKeySchema, { query: true }),
    TopupController.get_subdomain
)

router.get(
    '/plan_details_by_id',
    TopupController.plan_details_by_id
)

router.get(
    '/get_user_transactions',
    validate(validator.publicKeySchema, { query: true }),
    TopupController.get_user_transactions
)

router.get('/get_active_plan_list', TopupController.get_active_plan_list)

router.get('/users_active_plan', TopupController.users_active_plan)

module.exports = router
