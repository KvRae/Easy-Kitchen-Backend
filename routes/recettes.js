var express = require('express');
var router = express.Router();

var recette = require('../models/recette');
const RecetteCtrl = require('../controllers/RecetteController');

router.get('/', RecetteCtrl.getAll);
router.get('/:id', RecetteCtrl.getRecettebyid);
<<<<<<< HEAD
router.get('/:id/comments', RecetteCtrl.getAllByRecette);

router.post('/', RecetteCtrl.add);

router.patch('/:id/like',RecetteCtrl.likeRecette)

router.patch('/:id/dislike',RecetteCtrl.dislikeRecette)


=======

router.post('/', RecetteCtrl.add);

>>>>>>> 9380333679434627b3a9a1355af6ba0adc8b34f5
router.patch('/:id', RecetteCtrl.edit);

router.delete('/:id', RecetteCtrl.delete);

<<<<<<< HEAD


=======
>>>>>>> 9380333679434627b3a9a1355af6ba0adc8b34f5
module.exports = router;