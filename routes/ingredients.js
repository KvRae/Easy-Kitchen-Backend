var express = require('express');
var router = express.Router();

var Ing = require('../models/ingredient');
const IngCtrl = require('../controllers/IngredientsController');

router.get('/', IngCtrl.getAll);

router.post('/', IngCtrl.add);

router.patch('/:id', IngCtrl.edit);

router.delete('/:id', IngCtrl.delete);

module.exports = router;