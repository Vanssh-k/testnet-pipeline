import joi from 'joi'

export const symbolSchema = joi.object({
  symbol: joi.string().required().messages({
    'any.required': `token symbol not found`,
  }),
})

export const cidSchema = joi.object({
  cid: joi.string().required().messages({
    'any.required': `cid not found`,
  }),
  network: joi.string().optional(),
})

export const dealIdSchema = joi.object({
  dealId: joi.string().required().messages({
    'any.required': `deal ID not found`,
  }),
  network: joi.string().optional(),
})

export const bundleSchema = joi.object({
  bundleId: joi.string().required().messages({
    'any.required': `bundle ID not found`,
  }),
})

export const addCidSchema = joi.object({
  name: joi.string().required().messages({
    'any.required': `file name not found`,
  }),
  cid: joi.string().required().messages({
    'any.required': `cid not found`,
  }),
})

export const pinningSchema = joi.object({
  cid: joi.string().required().messages({
    'any.required': `cid not found`,
  }),
  fileName: joi.string(),
  raas: joi.any(),
})

export const migrationRequestSchema = joi.object({
  data: joi.string().required().messages({
    'any.required': `data not found`,
  }),
})

export const migrationRequestEntSchema = joi.object({
  data: joi.string().required().messages({
    'any.required': `data not found`,
  }),
  publicKey: joi.string().required().messages({
    'any.required': `publicKey not found`,
  }),
  enterprise: joi.string().required().messages({
    'any.required': `enterprise name not found`,
  }),
})

export const migrationRequestIdSchema = joi.object({
  requestId: joi.string().required().messages({
    'any.required': `requestId not found`,
  }),
})

export const addCIDToQueueSchema = joi.object({
  publicKey: joi.string().required().messages({
    'any.required': `publicKey not found`,
  }),
  name: joi.string().required().messages({
    'any.required': `file name not found`,
  }),
  size: joi.string().required().messages({
    'any.required': `file size not found`,
  }),
  cid: joi.string().required().messages({
    'any.required': `cid not found`,
  }),
  mimeType: joi.any(),
  encryption: joi.boolean().required().messages({
    'any.required': `encryption not found`,
  }),
})
