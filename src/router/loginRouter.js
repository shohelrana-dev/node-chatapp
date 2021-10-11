//dependencies
const express = require('express');
const router = express.Router();
const { getLogin, login, logout } = require('../controllers/loginController');
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse');
const { loginValidators, loginValidatorHandler } = require('../middlewares/login/loginValidators');

//set page title
let page_title = 'Login';

//get login page
router.get('/', decorateHtmlResponse(page_title), getLogin);

//do login
router.post('/', decorateHtmlResponse(page_title), loginValidators, loginValidatorHandler, login);

//do logout
router.delete('/', logout);

module.exports = router;