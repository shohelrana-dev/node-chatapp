//dependencies
const express = require('express');
const router = express.Router();
const { getUsers, addUser, deleteUser } = require('../controllers/usersController');
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse');
const avatarUpload = require('../middlewares/users/avatarUpload');
const { addUserValidators, addUserValidationHandler } = require('../middlewares/users/userValidators');
const checkLogin = require('../middlewares/common/checkLogin');

//users page
router.get('/', decorateHtmlResponse('Users'), checkLogin, getUsers);

//create user
router.post('/', checkLogin, avatarUpload, addUserValidators, addUserValidationHandler, addUser);

//delete user
router.delete('/:id', checkLogin, deleteUser);

module.exports = router;