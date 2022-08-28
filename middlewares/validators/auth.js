const joi = require("joi");

module.exports.verifySignerSchema = joi.object({
  signedMesage: joi.string().required().messages({
    "any.required": `signedMesage not found`,
  }),
  publicKey: joi.string().required().messages({
    "any.required": `publicKey not found`,
  }),
});
