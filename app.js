var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');



// import routes
var indexRouter = require('./routes/index');

var productRouter = require('./routes/product');
var authUserRouter = require('./routes/authUser');
var userCartRouter = require('./routes/userCart');
var userCheckoutRouter = require('./routes/userCheckout');

var vdProductRouter = require('./routes/vendor/vendorProduct');


var app = express();

// CORS

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Headers", "Origin,Content-Type, Authorization, x-id, Content-Length, X-Requested-With");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   next();
// });

// untuk cors

app.use (cors());

// var bodyParser= require('body-parser');

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }))
 
// parse application/json
// app.use(bodyParser.json())
 
// app.use(function (req, res) {
//   res.setHeader('Content-Type', 'text/plain')
//   res.write('you posted:\n')
//   res.end(JSON.stringify(req.body, null, 2))
// })

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// API routes

app.use('/', indexRouter);
app.use('/api/product', productRouter);
app.use('/api/auth', authUserRouter);
app.use('/api/usercart', userCartRouter);
app.use('/api/checkout', userCheckoutRouter)

// API routes - vendor

app.use('/api/vd/product', vdProductRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
