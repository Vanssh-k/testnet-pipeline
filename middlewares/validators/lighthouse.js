const joi = require("joi");

module.exports.symbolSchema = joi.object({
  symbol: joi.string().required().messages({
    "any.required": `token symbol not found`,
  }),
});

module.exports.cidSchema = joi.object({
  cid: joi.string().required().messages({
    "any.required": `cid not found`,
  }),
});

module.exports.addCidSchema = joi.object({
  name: joi.string().required().messages({
    "any.required": `file name not found`,
  }),
  cid: joi.string().required().messages({
    "any.required": `cid not found`,
  }),
});

module.exports.bulkCidAddSchema = joi.object({
  data: joi.string().required().messages({
    "any.required": `data not found`,
  }),
  signedMesage: joi.string().required().messages({
    "any.required": `signedMesage not found`,
  }),
  publicKey: joi.string().required().messages({
    "any.required": `publicKey not found`,
  }),
});

module.exports.orderIdSchema = joi.object({
  orderId: joi.string().required().messages({
    "any.required": `orderId not found`,
  }),
});

module.exports.addCIDToQueueSchema = joi.object({
  publicKey: joi.string().required().messages({
    "any.required": `publicKey not found`,
  }),
  name: joi.string().required().messages({
    "any.required": `file name not found`,
  }),
  size: joi.string().required().messages({
    "any.required": `file size not found`,
  }),
  cid: joi.string().required().messages({
    "any.required": `cid not found`,
  }),
});
