const joi = require('joi')

module.exports.recordTransactionSchema = joi.object({
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

module.exports.subscriptionIdSchema = joi.object({
    subscriptionId: joi.string().required().messages({
        'any.required': `subscriptionId not found`,
    }),
})
