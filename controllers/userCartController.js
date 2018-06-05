var db = require('../config/database');
var jwt = require('jsonwebtoken');
var jwtConfig =require('../config/jwtConfig');
var authenticate = require('../utility/authenticate');

function postUserCart(req, res, next) {
    authenticate(req, res, next);
    console.log(req.body)
    // console.log(req.currentUser)
    if (req.currentUser){
        var psql1=`select id from product where id=$1 and stock>$2`
        db.oneOrNone(psql1 , [req.body.productId, req.body.quantity])
            .then(function(row){
                if (row){
                    var psql2=`insert into user_cart (user_id, product_id, quantity, deliver_date)
                    select a.id, $1, $2, $3
                    from user_login A where uuid=$4
                    ON CONFLICT (user_id, product_id, deliver_date)
                    DO UPDATE SET quantity=user_cart.quantity+Excluded.quantity;`
                    db.none(psql2, [req.body.productId, req.body.quantity, req.body.deliveryDate, req.currentUser.id])
                    .then(function () {
                        res.status(200)
                        .json({
                        status: 'success',
                        message: 'Item berhasil ditambahkan!'
                        });
                    })
                }
                else {
                    res.status(200)
                    .json({
                    status: 'error',
                    message: 'Stock tidak cukup!'
                    });
                }
            })
            .catch(function (err) {
                return next(err);
            });
    }
}


function getUserCart(req, res, next) {
    authenticate(req, res, next);
    // console.log(req.currentUser)
    if (req.currentUser){
        var psql=`select a.id as cart_id, product_id, quantity, deliver_date, product_name, price, stock_unit, minimum, step, stock, product_image, vendor_name 
        from user_cart A 
        join product B on product_id=b.id
        join vendor C on c.id=vendor_id
        where user_id=(select id from user_login where uuid=$1)`
        db.any(psql, req.currentUser.id)
            .then(function (rows) {
                res.status(200)
                    .json({
                        status: 'success',
                        data: rows
                    });
            })
            .catch(function (err) {
                return next(err);
            });
    }

}

function deleteUserCart(req, res, next){
    authenticate(req, res, next);
    if (req.currentUser){
        db.result('delete from user_cart where id = $1', req.params.id)
        .then(function (result) {
            /* jshint ignore:start */
            res.status(200)
            .json({
                status: 'success',
                message: `Removed ${result.rowCount} row`
            });
            /* jshint ignore:end */
        })
        .catch(function (err) {
            return next(err);
        });
    }
}

module.exports = {
    postUserCart: postUserCart,
    getUserCart: getUserCart,
    deleteUserCart: deleteUserCart
};
