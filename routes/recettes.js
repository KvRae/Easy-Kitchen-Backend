var express = require('express');
var router = express.Router();

var recette = require('../models/recette');
const RecetteCtrl = require('../controllers/RecetteController');

router.get('/', RecetteCtrl.getAll);
router.get('/:id', RecetteCtrl.getRecettebyid);

router.post('/', RecetteCtrl.add);

router.patch('/:id', RecetteCtrl.edit);

router.delete('/:id', RecetteCtrl.delete);

module.exports = router;