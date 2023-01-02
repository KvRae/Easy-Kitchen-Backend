var express = require('express');
var router = express.Router();

var food = require('../models/food');
const foodCtrl = require('../controllers/FoodController');

router.get('/', foodCtrl.getAll);
router.get('/vegan', foodCtrl.getAllVegan);
router.get('/Vegetarian', foodCtrl.getAllVegetarian);


router.get('/:id', foodCtrl.getById);

module.exports = router;