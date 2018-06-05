var db = require('../config/database');
var path = require('path');
var multer = require('multer');
var imgUrl= require('../utility/add_product_image_url');

// set storage engine

const storage= multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb){
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  })
  

// init upload

const upload = multer({
    storage: storage,
    limits: {fileSize: 1024*1024*5},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
  }).single("product_image");

// check file type

function checkFileType(file, cb){
    // allowed
    const filetypes= /jpeg|jpg|png|gif/;
    // check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // check mime
    const mimetype= filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    }
    else (
        cb('Error: Image only!')
    )
}


function getVendorProduct(req, res, next) {
    var vendorID = parseInt(req.params.id);
    db.many('select * from product where vendor_id= $1', vendorID)
        .then(function (rows) {
            imgUrl.many(rows);
            res.status(200)
                .json({
                    status: 'success',
                    data: rows,
                    message: 'retrieved all products'
                });
        })
        .catch(function (err) {
            return next(err);
        });
  }
  
function getSingleProduct(req, res, next) {
    var productID = parseInt(req.params.id);
    db.one('select * from product where id = $1', productID)
        .then(function (row) {
            imgUrl.one(row);
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


function createProduct(req, res, next){
    // untuk upload gambar
    upload(req , res, (err) => {
        if (err){
            console.log(err)
        }
        else {
            console.log(req.file);
            req.body.product_image=req.file.filename
            console.log(req.body);
            var psql='insert into product (product_name, ctg_id, vendor_id, price, stock_unit, minimum, step, stock, upd_user, product_description, product_image)'
            +'values (${product_name}, ${ctg_id}, ${vendor_id}, ${price}, ${stock_unit}, ${minimum}, ${step}, ${stock}, ${upd_user}, ${product_description}, ${product_image})';
            db.none(psql, req.body)
                .then(function () {
                    res.status(200)
                        .json({
                            status: 'success',
                            message: 'inserted',
                        });
                })
                .catch(function (err){
                    return next(err);
                });
        }
    })

}
  

module.exports = {
    getVendorProduct: getVendorProduct,
    getSingleProduct: getSingleProduct,
    createProduct: createProduct
};
