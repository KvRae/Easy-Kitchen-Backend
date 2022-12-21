const multer = require("multer")

const storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, './images');
    },
    filename: function (request, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});

const upload = multer({
    storage: storage,
})

module.exports = upload;