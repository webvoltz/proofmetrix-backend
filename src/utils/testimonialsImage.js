const multer = require('multer');
const fs = require('fs');

// Directory to store uploaded images
const uploadDirectory = './assets';

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

const storageImg = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, uploadDirectory);
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop());
    }
});

const uploadImg = multer({ storage: storageImg });

module.exports = uploadImg;


