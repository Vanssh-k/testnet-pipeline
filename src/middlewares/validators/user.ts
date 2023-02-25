import joi from 'joi'

export const publicKeySchema = joi.object({
    publicKey: joi.string().required().messages({
        'any.required': `publicKey not found`,
    }),
})

export const userUploadsSchema = joi.object({
    publicKey: joi.string().required().messages({
        'any.required': `publicKey not found`,
    }),
    pageNo: joi.number().integer().messages({
        'any.required': `pageNo not found`,
    }),
})
