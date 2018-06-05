var express = require('express');
var router = express.Router();

var userCartController = require('../controllers/userCartController');


router.post('/', userCartController.postUserCart);
router.get('/', userCartController.getUserCart);
router.delete('/:id', userCartController.deleteUserCart )


module.exports = router;