var express = require('express');
var router = express.Router();

var food = require('../models/food');
const foodCtrl = require('../controllers/FoodController');

router.get('/', foodCtrl.getAll);

router.get('/:id', foodCtrl.getById);

module.exports = router;