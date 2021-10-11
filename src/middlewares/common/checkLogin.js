const jwt = require('jsonwebtoken');

function checkLogin(req, res, next) {
    let cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

    if (cookies) {
        try {
            let token = cookies[process.env.COOKIE_NAME];
            let decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (res.locals.html) {
                res.locals.loggedInUser = decoded;
            }
            return next();
        } catch (error) {
            if (res.locals.html) {
                return res.redirect('/');
            } else {
                return res.status(500).json({
                    common: {
                        msg: 'Authentication failure!'
                    }
                });
            }
        }
    } else {
        if (res.locals.html) {
            return res.redirect('/');
        } else {
            return res.status(500).json({
                common: {
                    msg: 'Authentication failure!'
                }
            });
        }
    }
}

module.exports = checkLogin;