
// ganti ES6 promise dengan bluebird
var promise = require('bluebird');

var options = {
    // Initialization Options
    promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString= 'postgres://fernando:12345@localhost:5432/kitchen_supply';
var db = pgp(connectionString);

module.exports = db;



