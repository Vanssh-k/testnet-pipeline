const joi = require('joi')

module.exports.verifySignerSchema = joi.object({
    signedMessage: joi.string().required().messages({
        'any.required': `signedMessage not found`,
    }),
    publicKey: joi.string().required().messages({
        'any.required': `publicKey not found`,
    }),
})

module.exports.tweetRechargeSchema = joi.object({
    twitterID: joi.string().required().messages({
        'any.required': `twitterID not found`,
    }),
    publicKey: joi.string().required().messages({
        'any.required': `publicKey not found`,
    }),
})

module.exports.saveEncryptionPublicKeySchema = joi.object({
    encryptionPublicKey: joi.string().required().messages({
        'any.required': `encryptionPublicKey not found`,
    }),
    publicKey: joi.string().required().messages({
        'any.required': `publicKey not found`,
    }),
})
