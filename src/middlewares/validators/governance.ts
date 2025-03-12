import joi, { Schema } from 'joi'

export const addProposalSchema: Schema = joi.object({
  proposal: joi.string().required().messages({
    'any.required': `Proposal not found`,
  }),
  publicKey: joi.string().required().messages({
    'any.required': `publicKey not found`,
  }),
})
