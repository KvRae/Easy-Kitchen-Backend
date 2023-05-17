var express = require('express')
var router = express.Router()
const multer = require('multer');

const UserCtrl = require('../controllers/UserController');

/* multer Configuration */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
  
      const userId = req.params.userId;
      const uploadDir = `./uploads/${userId}`;
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "--" + file.originalname);
    },
  });
  
  const fileFilter = (req, file, cb) => {

    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb({ message: "Unsupported File Format" }, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 },
    fileFilter: fileFilter,
  });
  /* multer configuration end */

router.put('/upload/:userId',upload.single('file'), UserCtrl.uploadImage);

router.get('/image/:userId/:imageName',UserCtrl.getImage)

router.get('/:id', UserCtrl.getUserbyid);

router.patch('/:id', UserCtrl.updateUser);

router.delete('/:id', UserCtrl.deleteUser);

router.put('/:id', UserCtrl.changePassword);

module.exports = router;