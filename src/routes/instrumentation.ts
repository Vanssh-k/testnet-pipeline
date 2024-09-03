import express from 'express'
import validate from '../middlewares/validate.js'
import validator from '../middlewares/validators/index.js'
import {
  pool_metric,
  user_metric,
  all_transactions,
  user_transactions,
  historic_tvl,
  historic_volume,
  historic_fees,
  historic_depositors,
} from '../controller/instrumentation/index.js'

const router = express.Router()

router.get('/pool_metric', pool_metric)
router.get('/user_record', validate(validator.userAddressSchema, { query: true }), user_metric)
router.get('/transactions', all_transactions)
router.get('/user_transactions', validate(validator.userAddressSchema, { query: true }), user_transactions)
router.get('/historic_tvl', historic_tvl)
router.get('/historic_volume', historic_volume)
router.get('/historic_fees', historic_fees)
router.get('/historic_depositors', historic_depositors)

export default router
