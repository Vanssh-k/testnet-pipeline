import express from 'express'
import validate from '../middlewares/validate'
import validator from '../middlewares/validators'
import {
  fundReceive_balance,
  endowment_balance,
  accumulated_balance,
  net_deposit,
  net_withdrawl,
  iFil_balance,
  endowment_transactions,
} from '../controller/instrumentation'

const router = express.Router()

// pay-per-use balance in fundReceive Contract
router.get(
  '/fundReceive_balace',
  validate(validator.tokenAddressSchema, { query: true }),
  fundReceive_balance
)

// endowment balance in endowment Contract
router.get(
  '/endowment_balance',
  validate(validator.tokenAddressSchema, { query: true }),
  endowment_balance
)

// amount staked in glif + yield generated
router.get('/accumulated_balance', accumulated_balance)

// total amount deposited till now
router.get('/net_deposit', net_deposit)

// total amount withdrawn till now
router.get('/net_withdrawl', net_withdrawl)

// total amount withdrawn till now
router.get('/iFil_balance', iFil_balance)

// endowment transactions
router.get('/endowment_transactions', endowment_transactions)

export default router
