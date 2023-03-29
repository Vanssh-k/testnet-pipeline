import joi from 'joi'

export const verifyPublishSchema = joi.object({
  cid: joi.string().required().messages({
    'any.required': `cid not found`,
  }),
  keyName: joi.string().min(1).max(100).required().messages({
    'any.required': `keyName not found`,
  }),
})

export const verifyRemoveSchema = joi.object({
  keyName: joi.string().min(1).max(100).required().messages({
    'any.required': `keyName not found`,
  }),
})
