const { body, validationResult } = require("express-validator");
const createHttpError = require("http-errors");
const User = require("../../models/User");
const fs = require('fs');
const path = require("path");

const addUserValidators = [
    body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Invalid email address').custom(async (value) => {
        try {
            let user = await User.findOne({ email: value });
            if (user) {
                throw createHttpError('The email already used!');
            }
        } catch (error) {
            throw createHttpError(error.message);
        }
    }),
    body('mobile').isMobilePhone('bn-BD')
        .withMessage('Mobile number must be a valid mobile number'),
    body('password').isStrongPassword().withMessage(
        'Password must be at least 8 characters & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol'
    )
];

function addUserValidationHandler(req, res, next) {
    let errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    //delete uploaded file
    if (req.files?.avatar) {
        let filename = req.files.avatar.name;
        let uploadsDir = path.join(__dirname, '../../../public/uploads/avatars/');

        fs.unlink(uploadsDir + filename, (err) => {
            if (err) console.log(err);
        });
    }

    return res.status(500).json({
        errors: errors.mapped()
    });
}

module.exports = { addUserValidators, addUserValidationHandler };