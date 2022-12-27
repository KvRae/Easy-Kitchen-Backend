var express = require('express');
var router = express.Router();
var User = require('../models/user');
<<<<<<< HEAD
const UserCtrl = require('../controllers/userController');
=======
const UserCtrl = require('../controllers/UserController');
>>>>>>> 9380333679434627b3a9a1355af6ba0adc8b34f5

router.get('/', UserCtrl.getAllUser);

router.get('/:id', UserCtrl.getUserbyid);

router.patch('/:id', UserCtrl.updateUser);

router.delete('/:id', UserCtrl.deleteUser);

module.exports = router;
