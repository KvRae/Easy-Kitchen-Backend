var express = require('express');
var router = express.Router();
const multer = require('multer');
var recette = require('../models/recette');
const RecetteCtrl = require('../controllers/RecetteController');

/* multer Configuration */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
  
      const recetteId = req.params.recetteId;
      const uploadDir = `./uploads/${recetteId}`;
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
router.put('/upload/:recetteId',upload.single('file'), RecetteCtrl.uploadImage);

router.get('/image/:recetteId/:imageName',RecetteCtrl.getImage)

router.get('/', RecetteCtrl.getAll);
router.get('/bio', RecetteCtrl.getAllBio);

router.get('/:id', RecetteCtrl.getRecettebyid);

router.get('/:id/comments', RecetteCtrl.getAllByRecette);

router.get('/:id/recettes', RecetteCtrl.getAllByUser);


router.post('/', RecetteCtrl.add);

router.post('/:id/like',RecetteCtrl.likeRecette)

router.post('/:id/dislike',RecetteCtrl.dislikeRecette)



router.patch('/:id', RecetteCtrl.edit);

router.delete('/:id', RecetteCtrl.delete);

module.exports = router;