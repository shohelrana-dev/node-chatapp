const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const createError = require('http-errors');


async function getInbox(req, res) {
    res.locals.data = await Conversation.find({
        $or: [
            {"creator.id": req.user._id},
            {"participant.id": req.user._id},
        ],
    });
    return res.render('inbox');
}

async function searchUser(req, res) {
    let user = req.body.user;
    let searchQuery = new RegExp(user, "i");
    try {
        if (searchQuery !== "") {
            let users = await User.find({
                name: searchQuery
            });

            return res.json(users);
        } else {
            throw createError("You must provide some text to search!");
        }
    } catch (err) {
        res.status(500).json({
            errors: {
                common: {
                    msg: err.message,
                },
            },
        });
    }
}

async function addConversation(req, res) {
    try {
        let newConversation = new Conversation({
            creator: {
                id: req.user._id,
                name: req.user.name,
                avatar: req.user.avatar || null,
            },
            participant: {
                name: req.body.participant,
                id: req.body.id,
                avatar: req.body.avatar || null,
            },
        });

        const result = await newConversation.save();
        return res.status(200).json({
            success: true,
            message: "Conversation was added successfully!"
        });
    } catch (err) {
        res.status(500).json({
            errors: {
                common: {
                    msg: err.message,
                },
            },
        });
    }
}

async function getMessages(req, res) {
    let messages = await Message.find({
        conversationId: req.params.conversationId
    }).sort('-createdAt');

    let {participant} = await Conversation.findById(req.params.conversationId);

    return res.json({
        messages,
        participant,
        user: req.user._id,
        conversationId: req.params.conversationId
    })

}

async function addMessage(req, res) {
    try {
        let newMessage = await new Message({...req.body});
        newMessage.save();

        global.io.emit('new_message', {...req.body});

        return res.status(201).json({
            success: true,
            message: 'Message saved'
        });

    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

module.exports = {getInbox, searchUser, addConversation, getMessages, addMessage};