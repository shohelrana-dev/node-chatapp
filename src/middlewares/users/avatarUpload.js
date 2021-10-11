//dependencies
const path = require('path');

function avatarUpload(req, res, next) {
    let allowd_file_types = ['image/jpg', 'image/jpeg', 'image/png'];
    let max_file_size = 1000000;
    let error_msg = 'Only jpg, jpeg or png format allwed';

    let avatar = req?.files?.avatar;
    if (!avatar) return next();

    if (allowd_file_types.indexOf(avatar.mimetype) === -1) {
        return res.status(500).json({
            errors: {
                avatar: {
                    msg: 'Only jpg, jpeg or png format allwed'
                }
            }
        });
    }

    let fileExt = path.extname(avatar.name);
    let fileName = avatar.name.replace(fileExt, '').toLowerCase().split(' ').join('-') + '-';

    let UniquefileName = fileName + Date.now() + fileExt;
    let uploadDir = path.join(__dirname, '../../../public/uploads/avatars/');

    avatar.mv(uploadDir + UniquefileName, (err) => {
        if (err) {
            return res.status(500).json({
                errors: { avatar: { msg: err.message } }
            });
        }
        req.files.avatar.name = UniquefileName;
        return next();
    })
}

module.exports = avatarUpload;