var express = require('express')
var router = express.Router()


const UserCtrl = require('../controllers/UserController');


router.get('/:id', UserCtrl.getUserbyid);

router.patch('/:id', UserCtrl.updateUser);

router.delete('/:id', UserCtrl.deleteUser);

router.put('/:id', UserCtrl.changePassword);

module.exports = router;
