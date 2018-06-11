'use strict';

//Imports
const mongoose = require('../dbServices/dbConn.js').mongoose;
//const db = require('../dbServices/dbConn.js').db;
const typeOf = require('type-of');
const JWT = require('../helperServices/generateJWT.js');
// user model
const User = require('../models/userModels').User;

module.exports.login = (req, res) => {

    const email = req.query.email;
    let password = req.query.password;
    // extra flag to indicate if user is active or not
    if(email === '' || typeOf(email) === 'undefined' || password === '' || typeOf(password) === 'undefined') {

        return res.status(422).json({
        message: 'mandatory parameter missing'
        });
    }
    
   // password = password.toString();
  
   User.check(email, password, (status, message, flag) => {
     if(status === 200) {
       JWT.generate(email, (token, exp) => {
         return res.status(status).json({
          token: token,
          expiresIn: exp
         });
       });
     } else {
     return res.status(status).json({
        message: message,
        access: flag
        });
    }
 });

} // end of login




