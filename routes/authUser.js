var express = require('express');
var router = express.Router();

var authUserController = require('../controllers/authUserController');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });


router.post('/', authUserController.authUser);


module.exports = router;