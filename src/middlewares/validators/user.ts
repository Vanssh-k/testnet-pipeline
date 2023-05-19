import joi from 'joi'

export const publicKeySchema = joi.object({
  publicKey: joi.string().required().messages({
    'any.required': `publicKey not found`,
  }),
})

export const getUploadsSchema = joi.object({
  publicKey: joi.string().required().messages({
    'any.required': `publicKey not found`,
  }),
  pageNo: joi.number().integer().messages({
    'any.required': `pageNo not found`,
  }),
})

export const createTagSchema = joi.object({
  cid: joi.string().required().messages({
    'any.required': `File cid not found`,
  }),
  tag: joi.string().required().messages({
    'any.required': `File tag not found`,
  }),
})

export const getTagSchema = joi.object({
  tag: joi.string().required().messages({
    'any.required': `tag not found`,
  }),
})
