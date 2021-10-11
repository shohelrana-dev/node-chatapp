//dependencies
const express = require('express');
const router = express.Router();
const { getInbox, searchUser, addConversation, getMessages, addMessage } = require('../controllers/inboxController');
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse');
const checkLogin = require('../middlewares/common/checkLogin');

//inbox
router.get('/', decorateHtmlResponse('Inbox'), checkLogin, getInbox);

//search users
router.post('/search', checkLogin, searchUser);

//create conversation
router.post('/conversation', checkLogin, addConversation);

//get messages
router.get('/messages/:conversationId', checkLogin, getMessages);

//add message
router.post('/messages/:conversationId', checkLogin, addMessage);

module.exports = router;