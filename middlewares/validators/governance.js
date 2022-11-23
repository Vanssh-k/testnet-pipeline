const joi = require("joi");

module.exports.addProposalSchema = joi.object({
  proposal: joi.string().required().messages({
    "any.required": `Proposal not found`,
  }),
  publicKey: joi.string().required().messages({
    "any.required": `publicKey not found`,
  }),
});
