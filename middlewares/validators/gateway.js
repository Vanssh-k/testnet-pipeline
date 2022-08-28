const joi = require("joi");

module.exports.addSubdomainSchema = joi.object({
  subDomain: joi.string().required().messages({
    "any.required": `subDomain not found`,
  }),
  signedMesage: joi.string().required().messages({
    "any.required": `signedMesage not found`,
  }),
  publicKey: joi.string().required().messages({
    "any.required": `publicKey not found`,
  }),
});

module.exports.subdomainSchema = joi.object({
  subDomain: joi.string().required().messages({
    "any.required": `subDomain not found`,
  }),
});

module.exports.saveEncryptionKeySchema = joi.object({
  publicKey: joi.string().required().messages({
    "any.required": `publicKey not found`,
  }),
  fromPublicKey: joi.string().required().messages({
    "any.required": `fromPublicKey not found`,
  }),
  fileName: joi.string().required().messages({
    "any.required": `fileName not found`,
  }),
  nonce: joi.string().required().messages({
    "any.required": `nonce not found`,
  }),
  fileEncryptionKey: joi.string().required().messages({
    "any.required": `fileEncryptionKey not found`,
  }),
  fileSizeInBytes: joi.string().required().messages({
    "any.required": `fileSizeInBytes not found`,
  }),
  sharedFrom: joi.string().required().messages({
    "any.required": `sharedFrom not found`,
  }),
  sharedTo: joi.string().required().messages({
    "any.required": `sharedTo not found`,
  }),
  cid: joi.string().required().messages({
    "any.required": `cid not found`,
  }),
});

module.exports.getEncryptionKeySchema = joi.object({
  sharedTo: joi.string().required().messages({
    "any.required": `sharedTo not found`,
  }),
  cid: joi.string().required().messages({
    "any.required": `cid not found`,
  }),
});
