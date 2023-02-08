const joi = require('joi')

module.exports.addSubdomainSchema = joi.object({
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

module.exports.subdomainSchema = joi.object({
    subDomain: joi.string().required().messages({
        'any.required': `subDomain not found`,
    }),
})
