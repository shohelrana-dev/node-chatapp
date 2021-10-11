const createHttpError = require("http-errors");
const { body, validationResult } = require("express-validator");

const loginValidators = [
    body('username').trim().isLength({ min: 1 }).withMessage('Email or Mobile number is required'),
    body('password').trim().isLength({ min: 1 }).withMessage('Password is required')
];

function loginValidatorHandler(req, res, next) {
    let errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    return res.render('index', {
        data: { username: req.body.username },
        errors: errors.mapped()
    });
}

module.exports = { loginValidators, loginValidatorHandler };