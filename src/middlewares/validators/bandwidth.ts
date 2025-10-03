import joi, { Schema } from 'joi'

export const bandwidthQuerySchema: Schema = joi
  .object({
    client_id: joi.string().required().messages({
      'any.required': 'client_id is required',
    }),
    start_date: joi
      .string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .required()
      .messages({
        'any.required': 'start_date is required',
        'string.pattern.base': 'start_date must be in YYYY-MM-DD format',
      }),
    end_date: joi
      .string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .required()
      .messages({
        'any.required': 'end_date is required',
        'string.pattern.base': 'end_date must be in YYYY-MM-DD format',
      }),
  })
  .custom((value, helpers) => {
    const startDate = new Date(value.start_date)
    const endDate = new Date(value.end_date)

    if (startDate > endDate) {
      return helpers.error('custom.dateRange', {
        message: 'start_date cannot be after end_date',
      })
    }
    return value
  })
  .messages({
    'custom.dateRange': 'start_date cannot be after end_date',
  })
