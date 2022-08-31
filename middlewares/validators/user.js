const joi = require("joi");

module.exports.publicKeySchema = joi.object({
  publicKey: joi.string().required().messages({
    "any.required": `publicKey not found`,
  }),
});
