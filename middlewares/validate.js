const { validationResult } = require('express-validator');
const RequestValidationError = require("../errors/request-validation-error");

module.exports = (req, res, next) => { 
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let error = {};
            errors.array().map((err) => error[err.param] = err.msg);
            console.error(error);
            throw new RequestValidationError(errors.array());
        }
        next();
    } catch(error){
        next(error);
    }
};
