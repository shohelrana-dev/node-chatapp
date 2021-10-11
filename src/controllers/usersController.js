//dependencies
const fs = require('fs');
const bcrypt = require('bcrypt');
const User = require('../models/User');

//get users
async function getUsers(req, res, next) {
    try {
        let users = await User.find();
        res.render('users', { users });
    } catch (error) {
        next(error)
    }
}

//add user
async function addUser(req, res) {
    let newUser;
    let hashedPassword = await bcrypt.hash(req.body.password, 10);
    if (req.files && req.files.avatar) {
        newUser = new User({
            ...req.body,
            avatar: req.files.avatar.name,
            password: hashedPassword
        })
    } else {
        newUser = new User({
            ...req.body,
            password: hashedPassword
        })
    }

    //save user or send error
    try {
        let result = await newUser.save();
        return res.status(201).json({
            success: true,
            message: 'User was added successfully!'
        });
    } catch (error) {
        return res.status(500).json({
            errors: {
                common: {
                    msg: 'Unknown error occurd!'
                }
            }
        });
    }

}

//delete user
async function deleteUser(req, res) {
    try {
        let user = await User.findByIdAndDelete({
            _id: req.params.id
        });

        //delete avatar
        if (user.avatar) {
            let filename = req.files.avatar.name;
            let uploadsDir = path.join(__dirname, '../../../public/uploads/avatars/');
            fs.unlink(uploadsDir + filename, err => {
                if (err) console.log(err);
            })
        }

        //res
        return res.status(200).json({
            success: true,
            message: 'User was deleted successfully!'
        });

    } catch (error) {
        return res.status(500).json({
            errors: {
                common: {
                    msg: 'Could not delete the user!'
                }
            }
        });
    }
}

module.exports = { getUsers, addUser, deleteUser };