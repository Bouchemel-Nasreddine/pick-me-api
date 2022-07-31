const multer = require('multer');
const uuid = require('uuid');
const { normalize } = require('path')

const MYME_TYPES = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
}

const   fileUpload = multer({
    limits: 1000000,
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/images');

        },
        filename: (req, file, cb) => {
            const ext = MYME_TYPES[file.mimetype];            
            cb(null, uuid.v1() + '.' + ext);
        },
        filFilter: (req, file, cb) => {
            const isValid = !!MYME_TYPES[file.mimetype];
            let error = isValid ? null : new Error('Invalid file type');
            cb(error, isValid);
        }
    
        })

});

module.exports = fileUpload;