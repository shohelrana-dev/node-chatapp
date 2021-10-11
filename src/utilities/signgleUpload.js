const createHttpError = require("http-errors");
const multer = require("multer");

function uploader(subfolder_path, allowd_file_types, max_file_size, error_msg) {
    //make upload obj
    const UPLOADS_FOLDER = `${__dirname}/../public/uploads/${subfolder_path}/`;

    //define the storage
    const storage = multer.diskStorage({
        destination: (req,file, callback)=>{
            callback(null, UPLOADS_FOLDER)
        },
        filename: (req,file, callback)=>{
            const fileExt = path.extname(file.originalname);
            const fileName = file.originalname
            .replace(fileExt, '')
            .toLowerCase()
            .split(' ')
            .join('-') + '-' + Date.now();

            callback(null, fileName + fileExt);
        },
    });

    const upload = multer({
        storage: storage,
        limits: {fileSize: max_file_size},
        fileFilter: (req, file, callback)=>{
            if(allowd_file_types.includes(file.mimetype)){
                callback(null, true);
            }else{
                callback(createHttpError(error_msg))
            }
        }
    });

    return upload;
}

module.exports = uploader;