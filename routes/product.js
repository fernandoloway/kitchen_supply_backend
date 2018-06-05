var express = require('express');
var router = express.Router();

var productController = require('../controllers/productController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/cat/:id', productController.getProductsByCategory);
router.get('/:id', productController.getSingleProduct);


module.exports = router;