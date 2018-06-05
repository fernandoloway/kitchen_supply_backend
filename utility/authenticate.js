var jwt = require('jsonwebtoken');
var jwtConfig =require('../config/jwtConfig');
var db = require('../config/database');

function authenticate(req, res, next) {
    // cek authorization header
    const authorizationHeader= req.headers['authorization'];
    let token;

    // jika ada authorization header, ambil token
    if (authorizationHeader){
        // token adalah bearer spasi token jadi perlu di split
        token = authorizationHeader.split(' ')[1];
    }

    // jika ada token, validasi
    if (token){
        jwt.verify(token, jwtConfig.jwtSecret, (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Token false'});
            }
            else {
                req.currentUser=decoded;

                // db.oneOrNone('select id from user_login where uuid=$1', decoded.id)
                //     .then(function (user) {
                //         if (!user) {
                //             res.status(404).json({ error: 'harap login lagi'});
                //         }
                //         // jika semua OK simpan user
                //         req.currentUser= user;
                //         console.log(req.currentUser)
                        
                // })
                //     .catch(function (err) {
                //         return next(err);
                // });
            }
        });
    }
    // jika tidak ada kirim response error
    else {
        res.status(403).json({
            error: 'Tidak ada token, login dulu'
        })
    }
}

module.exports = authenticate;