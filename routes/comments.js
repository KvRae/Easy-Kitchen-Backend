var express = require('express');
var router = express.Router();

const commentCtrl = require('../controllers/CommentController');

router.get('/', commentCtrl.getAll);
router.post('/', commentCtrl.add);
router.patch('/:id', commentCtrl.edit);
router.delete('/:id', commentCtrl.delete);

module.exports = router;