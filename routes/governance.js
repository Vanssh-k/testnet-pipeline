const express = require("express");
const GovernanceController = require("../controller/governance");
const validate = require("../middlewares/validate");
const validator = require("../middlewares/validators");

const router = express.Router();

router.post(
  "/add_proposal",
  validate(validator.addProposalSchema, { body: true }),
  GovernanceController.add_proposal
);

router.get(
  "/get_proposals",
  GovernanceController.all_proposals
);

module.exports = router;
