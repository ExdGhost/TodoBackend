'use strict';

//Imports
const mongoose = require('../dbServices/dbConn.js').mongoose;
//const db = require('../dbServices/dbConn.js').db;
const sha256 = require('sha256');
const typeOf = require('type-of');
// user model
const User = require('../models/userModels').User;
const JWT = require('../helperServices/generateJWT.js');

//function - register user

module.exports.register = (req, res) => {

    let fname = req.body.fname;
    let lname = req.body.lname;
    let email = req.body.email;
    let password = req.body.password;
    // extra flag to indicate if user is active or not
    if(fname === '' || typeOf(fname) === 'undefined' || lname === '' || typeOf(lname) === 'undefined' || password === '' || typeOf(password) === 'undefined' || email === '' || typeOf(email) === 'undefined') {

        return res.status(422).json({
        message: 'mandatory parameter missing'
        });
    }

// trim all fields for safety
fname = fname.trim();
lname = lname.trim();
email = email.trim();
password = password.trim();
//----------------------------

    checkUser(email, (status, message) => {    
            if(status === 201 || status === 500 ){
                return res.status(status).json({
                    message: message
                    });
            } else if(status === 0) {
              
                createUser(fname, lname, email, password, (status1, message1) => {
                // if create user fails 
                  if(status1 === 500) {
                  return res.status(status1).json({
                      message: message1
                  });
                   // if create user succeeds
                } else if(status1 === 200) {
                    JWT.generate(email, (token, exp) => {
                        return res.status(status1).json({
                         token: token,
                         expiresIn: exp
                        });
                      }); // end of jwt generate call
                   } // end of inner else if
                }); // end of create user call
            } // end of else-if
            
    }); // end of check user call
    
} // end of register

const checkUser = (email, callback) => {
  // ler err code be 500 
  User.find({email:email}, (err, data) => {  
    if(err) {
        console.log(err);
        return callback(500, err);
    }  
    
    if(data.length === 0 ){
        // 0 indicates user does not exist and we must create a new entry
        return callback(0, null); 
      } else if (data.length === 1) {
          return callback(201, 'User already exists !');
    } 
  }); // end of find
  
} // end of check user

const createUser = (fname, lname, email, password, callback) => { 
   
    let active = true;
    const hashedPassw = sha256(password); 

    let newUser = new User({fname: fname, lname: lname, email:email, password: hashedPassw, active: active});

    newUser.save((err, newUserObj) => {
        
    if (err) {
        console.log(err);
        return callback(500, 'Unable to save in mongo db'); 
    }
      
      return callback(200, 'User registration successful');  
   });// end of new user save 

} // end of create user

