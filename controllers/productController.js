var db = require('../config/database');

var imgUrl= require('../utility/add_product_image_url');


function getProductsByCategory(req, res, next) {
    var categoryID = parseInt(req.params.id);
    var psql1='select * from product_category where id= $1;'
    var psql2=`select a.id, product_name, price, product_image, stock_unit, minimum, step, stock, upd_time, product_description, vendor_name, city from product A 
                join vendor B on a.vendor_id=b.id 
                join master_city C on c.id=b.vendor_city_id
                where a.ctg_id=$1;`
    db.multi(psql1+psql2, categoryID)
        .spread((category, products) => {
            imgUrl.bgImg(category[0]);
            imgUrl.many(products);
            res.status(200)
                .json({
                    status: 'success',
                    category: category[0],
                    products: products,
                    message: 'retrieved all products'
                });
        })
        .catch(function (err) {
            return next(err);
        });
  }
  
function getSingleProduct(req, res, next) {
    var productID = parseInt(req.params.id);
    var psql=`select a.id as id, product_name, vendor_id, price, stock_unit, minimum, step, stock, product_description, product_image, cat_name, vendor_name, city  from product A 
    join product_category B on a.ctg_id=b.id 
    join vendor C on a.vendor_id=c.id
    join master_city D on c.vendor_city_id=d.id
    where a.id=$1`
    db.one(psql, productID)
        .then(function (row) {
            imgUrl.one(row);
            imgUrl.bgImg(row);
            res.status(200)
                .json({
                    status: 'success',
                    data: row,
                    message: 'retrieved one product'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}
  

module.exports = {
    getProductsByCategory: getProductsByCategory,
    getSingleProduct: getSingleProduct
};
