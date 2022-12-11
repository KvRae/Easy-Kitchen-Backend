var express = require('express');
var router = express.Router();

var area = require('../models/area');
const areaCtrl = require('../controllers/AreaController');

router.get('/', areaCtrl.getAll);

router.get('/:id', areaCtrl.getById);

module.exports = router;