const RequestValidationError = require("../errors/request-validation-error");

module.exports = (schema, intercept) => {
  return (req, res, next) => {
    let payload =
      intercept.query && intercept.body
        ? { ...req.query, ...req.body }
        : intercept.body
        ? { ...req.body }
        : { ...req.query };
    const validated = schema.validate(payload, { allowUnknown: false });
    if (validated.error) {
      errors = validated.error.details.map((err) => {
        return {
          msg: err.message.replace(/"/g, ""),
          param: err.context.key,
        };
      });
      return next(new RequestValidationError(errors));
    }
    return next();
  };
};
