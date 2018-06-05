var db = require('../config/database');
var crypt = require('../utility/crypto');
var jwt = require('jsonwebtoken');
var jwtConfig =require('../config/jwtConfig');

  
function authUser(req, res, next) {
    console.log(req.body)
    const { identifier, password } =req.body;
    db.oneOrNone('select * from user_login where email=$1', identifier)
        .then(function (user) {
            if (user){
                console.log(user);
                if (crypt.decrypt(user.password)===password){
                    const token= jwt.sign({
                        id: user.uuid,
                        name: user.name
                    }, jwtConfig.jwtSecret);
                    res.status(200)
                        .json({token})
                }
                else {
                    // password salah
                    res.status(401).json({errors: { form: 'Email atau password salah!'}});
                }
            }
            else {
                // user tidak ada
                res.status(401).json({errors: { form: 'Email atau password salah!'}});
            }

        })
        .catch(function (err) {
            return next(err);
        });
}
  

module.exports = {
    authUser: authUser,
};
