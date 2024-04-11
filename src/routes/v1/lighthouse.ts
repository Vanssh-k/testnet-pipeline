import express from 'express'
import validate from '../../middlewares/validate.js'
import validator from '../../middlewares/validators/index.js'
import { getProof } from '../../controller/api/v1/getProof.js'
import { getDealInfo } from '../../controller/api/v1/getDealInfo.js'
import { getFileInfo } from '../../controller/api/v1/getFileInfo.js'
import { getRaasInfo } from '../../controller/api/v1/getRaasInfo.js'

const router = express.Router()

router.get('/get_proof', validate(validator.cidSchema, { query: true }), getProof)

router.get('/deal_info', validate(validator.dealIdSchema, { query: true }), getDealInfo)

router.get('/file_info', validate(validator.cidSchema, { query: true }), getFileInfo)

router.get('/raas_info', validate(validator.cidSchema, { query: true }), getRaasInfo)

export default router
