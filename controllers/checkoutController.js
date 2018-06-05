var db = require('../config/database');
var jwt = require('jsonwebtoken');
var jwtConfig =require('../config/jwtConfig');
var authenticate = require('../utility/authenticate');

function userCheckout (req, res, next) {

    authenticate(req, res, next);
    // console.log(req.body)

    if (req.currentUser){


        db.tx('my-transaction', t => {
            const {name, phone, alamat, provinsi, kota, kodepos} = req.body
            // t.ctx = transaction context object
            var psql=`Insert into invoice_hd (
                kode_invoice, invoice_date, total_price, user_id, vendor_id, rec_name, rec_phone, kode_pos, provinsi, kota, full_address, invoice_status) 
                Select 'INV1232131212', now(), sum(quantity*price), c.id, b.vendor_id, $1, $2, $3, $4, $5, $6,'paid'
                from user_cart A
                join product B on b.id=a.product_id,
                user_login C where c.uuid= $7
                group by b.vendor_id, c.id
                RETURNING id, vendor_id, user_id
                `
            
            return t.many(psql, [name, phone, kodepos, provinsi, kota,  alamat, req.currentUser.id ])
                .then(invoice => {
                    console.log(invoice[0].user_id)
                    const userId=(invoice[0].user_id);
                    var psql2=`Insert into invoice_dt (invoice_id, product_name, quantity, product_price, deliver_date)
                    select c.id, b.product_name, a.quantity, b.price, a.deliver_date
                    from user_cart A
                    join product B on a.product_id=b.id
                    join invoice_hd C on a.user_id=c.user_id and c.vendor_id=b.vendor_id
                    where a.user_id=$1`
                    return t.none(psql2, userId)
                        .then( () => {
                            var psql3=`Update product A  set stock=a.stock-b.quantity
                            from user_cart B
                            where user_id=$1 and b.product_id=a.id`;
                            return t.none(psql3, userId)
                                .then( () => {
                                    return t.result('Delete from user_cart where user_id=$1', userId)
                                }
                            )
                        });
                });
        })
        .then(data => {
            // success
            // data = as returned from the transaction's callback
            console.log(data)
            res.status(200)
            .json({
                status: 'success',
                data: data,
                message: 'created invoice, product stock updated, emptied user cart'
            });
        })
        .catch(err => {
            // error
            return next(err);
        });
    }
}



module.exports = {
    userCheckout: userCheckout
};
