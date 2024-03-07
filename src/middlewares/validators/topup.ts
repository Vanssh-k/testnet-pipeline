import joi from 'joi'

export const recordTransactionSchema = joi.object({
  txHash: joi.string().required().messages({
    'any.required': `txHash not found`,
  }),
  depositor: joi.string().required().messages({
    'any.required': `depositor not found`,
  }),
  tokenAddress: joi.string().required().messages({
    'any.required': `tokenAddress not found`,
  }),
  subscriptionID: joi.string().required().messages({
    'any.required': `subscriptionID not found`,
  }),
  chain: joi.string().required().messages({
    'any.required': `chain not found`,
  }),
})

export const addSubdomainSchema = joi.object({
  subDomain: joi.string().required().messages({
    'any.required': `subDomain not found`,
  }),
  signedMessage: joi.string().required().messages({
    'any.required': `signedMessage not found`,
  }),
  publicKey: joi.string().required().messages({
    'any.required': `publicKey not found`,
  }),
})

export const subdomainSchema = joi.object({
  subDomain: joi.string().required().messages({
    'any.required': `subDomain not found`,
  }),
})

export const subscriptionIdSchema = joi.object({
  subscriptionId: joi.string().required().messages({
    'any.required': `subscriptionId not found`,
  }),
})

export const tokenAddressSchema = joi.object({
  tokenAddress: joi
    .string()
    .default('0x0000000000000000000000000000000000000000'),
})
