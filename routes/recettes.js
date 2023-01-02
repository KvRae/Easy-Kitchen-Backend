var express = require('express');
var router = express.Router();

var recette = require('../models/recette');
const RecetteCtrl = require('../controllers/RecetteController');

router.get('/', RecetteCtrl.getAll);
router.get('/bio', RecetteCtrl.getAllBio);

router.get('/:id', RecetteCtrl.getRecettebyid);

router.get('/:id/comments', RecetteCtrl.getAllByRecette);

router.get('/:id/recettes', RecetteCtrl.getAllByUser);


router.post('/', RecetteCtrl.add);

router.patch('/:id/like',RecetteCtrl.likeRecette)

router.patch('/:id/dislike',RecetteCtrl.dislikeRecette)



router.patch('/:id', RecetteCtrl.edit);

router.delete('/:id', RecetteCtrl.delete);

module.exports = router;