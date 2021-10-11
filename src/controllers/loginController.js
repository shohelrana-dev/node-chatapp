//deps
const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//get login
function getLogin(req, res) {
    res.render('index');
}

//do login
async function login(req, res) {
    try {
        let user = await User.findOne({
            $or: [
                { email: req.body.username },
                { mobile: req.body.username }
            ]
        });

        if (user && user._id) {
            let isValidPassword = await bcrypt.compare(req.body.password, user.password);
            if (isValidPassword) {
                let userObject = {
                    _id: user._id,
                    name: user.name,
                    mobile: user.mobile,
                    email: user.email,
                    role: user.role
                };

                //generate token
                let token = jwt.sign(userObject, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRY
                });

                //set cookie
                res.cookie(process.env.COOKIE_NAME, token, {
                    maxAge: process.env.JWT_EXPIRY,
                    httpOnly: true,
                    signed: true
                });

                //set local vars
                res.locals.loggedInUser = userObject;

                //send response 
                return res.render('inbox');
            } else {
                throw createHttpError('Login failed! Please try again.');
            }
        } else {
            throw createHttpError('Login failed! Please try again.');
        }
    } catch (error) {
        return res.render('index', {
            data: { username: req.body.username },
            errors: {
                common: { msg: error.message }
            }
        });
    }
}

//do logout
function logout(req, res) {
    res.clearCookie(process.env.COOKIE_NAME);
    return res.json({ success: true, message: 'Logout successfully' });
}

module.exports = { getLogin, login, logout };