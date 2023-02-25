import express from 'express'
import { create_proposal, list_proposals } from '../controller/governance'
import validate from '../middlewares/validate'
import validator from '../middlewares/validators'

const router = express.Router()

router.post(
    '/create_proposal',
    validate(validator.addProposalSchema, { body: true }),
    create_proposal
)

router.get('/list_proposals', list_proposals)

export default router
