import express from 'express'
import { create_proposal, list_proposals } from '../controller/governance/index.js'
import validate from '../middlewares/validate.js'
import validator from '../middlewares/validators/index.js'

const router = express.Router()

router.post('/create_proposal', validate(validator.addProposalSchema, { body: true }), create_proposal)

router.get('/list_proposals', list_proposals)

export default router
