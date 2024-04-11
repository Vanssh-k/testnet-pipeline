import express from 'express'
import validate from '../../middlewares/validate.js'
import validator from '../../middlewares/validators/index.js'
import { get_deal_info, get_file_info, get_proof, get_raas_info } from '../../controller/filecoin/index.js'

const router = express.Router()

router.get('/get_proof', validate(validator.cidSchema, { query: true }), get_proof)

router.get('/deal_info', validate(validator.dealIdSchema, { query: true }), get_deal_info)

router.get('/file_info', validate(validator.cidSchema, { query: true }), get_file_info)

router.get('/raas_info', validate(validator.cidSchema, { query: true }), get_raas_info)

export default router
