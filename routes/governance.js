const express = require('express')
const GovernanceController = require('../controller/governance')
const validate = require('../middlewares/validate')
const validator = require('../middlewares/validators')

const router = express.Router()

router.post(
    '/create_proposal',
    validate(validator.addProposalSchema, { body: true }),
    GovernanceController.create_proposal
)

router.get('/list_proposals', GovernanceController.list_proposals)

module.exports = router
