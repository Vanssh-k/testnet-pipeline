import express from 'express'
import validate from '../middlewares/validate.js'
import validator from '../middlewares/validators/index.js'
import { fundReceive_balance, net_deposit, net_withdrawl, iFil_balance } from '../controller/instrumentation/index.js'

const router = express.Router()

// pay-per-use balance in fundReceive Contract
router.get('/fundReceive_balace', validate(validator.tokenAddressSchema, { query: true }), fundReceive_balance)

// total amount deposited till now
router.get('/net_deposit', net_deposit)

// total amount withdrawn till now
router.get('/net_withdrawl', net_withdrawl)

// total amount withdrawn till now
router.get('/iFil_balance', iFil_balance)

export default router
