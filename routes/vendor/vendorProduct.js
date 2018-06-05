var express = require('express');
var router = express.Router();

var vdProductController = require('../../controllers/vdProductController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/all/:id', vdProductController.getVendorProduct);
router.get('/:id', vdProductController.getSingleProduct);
router.post('/', vdProductController.createProduct);


module.exports = router;