var express = require('express');
var router = express.Router();

var checkoutController = require('../controllers/checkoutController');


router.post('/', checkoutController.userCheckout);



module.exports = router;