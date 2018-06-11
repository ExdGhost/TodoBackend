'use strict';
// const root = require('app-root-path');
const sha256 = require('sha256');
const mongoose = require(`../dbServices/dbConn.js`).mongoose;

//USER DATA MODEL

const userSchema = mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    password: String,
    active: Boolean
  });

// static function to find by email
userSchema.statics.check = function check(email , password, callback) {
   this.find({email:email}, (err, data) => {  
        if(err) {
            console.log(err);
            return callback(500, err, false);
    }         
  if(data.length === 0 ) {     
    return callback(201,'User does not exist', false);           
      } else if (data.length === 1) {
      // match password hash            
      if(sha256(password) === data[0].password && data[0].active === true) {
         return callback(200, 'Login successful!', true);
      } else {
          return callback(201, 'Invalid password / Access disabled', false);
      }                
    } // end of else -if  
  }); // end of find 
} 

module.exports.User = mongoose.model('User', userSchema);

