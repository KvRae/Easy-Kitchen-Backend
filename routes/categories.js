var express = require('express');
var router = express.Router();

var Cat = require('../models/category');
const CatCtrl = require('../controllers/CategoryController');

router.get('/', CatCtrl.getAll);

module.exports = router;