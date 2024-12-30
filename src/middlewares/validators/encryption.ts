import joi, { Schema } from 'joi'

export const saveFileEncryptionKeySchema: Schema = joi.object({
  publicKey: joi.string().required().messages({
    'any.required': `publicKey not found`,
  }),
  fromPublicKey: joi.string().required().messages({
    'any.required': `fromPublicKey not found`,
  }),
  fileName: joi.string().required().messages({
    'any.required': `fileName not found`,
  }),
  nonce: joi.string().required().messages({
    'any.required': `nonce not found`,
  }),
  fileEncryptionKey: joi.string().required().messages({
    'any.required': `fileEncryptionKey not found`,
  }),
  fileSizeInBytes: joi.string().required().messages({
    'any.required': `fileSizeInBytes not found`,
  }),
  sharedFrom: joi.string().required().messages({
    'any.required': `sharedFrom not found`,
  }),
  sharedTo: joi.string().required().messages({
    'any.required': `sharedTo not found`,
  }),
  cid: joi.string().required().messages({
    'any.required': `cid not found`,
  }),
})

export const getFileEncryptionKeySchema: Schema = joi.object({
  sharedTo: joi.string().required().messages({
    'any.required': `sharedTo not found`,
  }),
  cid: joi.string().required().messages({
    'any.required': `cid not found`,
  }),
})
