const express = require('express')
const TopupController = require('../controller/topup')
const validate = require('../middlewares/validate')
const validator = require('../middlewares/validators')
const authenticator = require('../middlewares/authenticator')

const router = express.Router()

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
    '/get_user_transaction_details',
    validate(validator.publicKeySchema, { query: true }),
    TopupController.get_user_transaction_details
)

router.get('/get_active_plan_list', TopupController.get_active_plan_list)

router.get('/users_active_plan', TopupController.users_active_plan)

module.exports = router
