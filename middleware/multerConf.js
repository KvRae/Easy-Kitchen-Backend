const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

export default multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, 'uploads');
        },
        filename: (req, file, callback) => {
            const name = file.originalname.split(' ').join('_');
            const extension = MIME_TYPES[file.mimetype];
            callback(null, name + Date.now() + '.' + extension);
        },
    }),
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, callback) => {
        const isValid = !!MIME_TYPES[file.mimetype];
        let error = isValid ? null : new Error('Invalid mime type!');
        callback(error, isValid);
    }
}).single('image');


