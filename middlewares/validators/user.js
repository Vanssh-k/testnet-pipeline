const joi = require("joi");

module.exports.publicKeySchema = joi.object({
  publicKey: joi.string().required().messages({
    "any.required": `publicKey not found`,
  }),
});

module.exports.userUploadsSchema = joi.object({
  publicKey: joi.string().required().messages({
    "any.required": `publicKey not found`,
  }),
  pageNo: joi.number().integer().messages({
    "any.required": `pageNo not found`,
  }),
});
