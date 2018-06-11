'use strict';

const typeOf = require('type-of');
// user model
const UserData = require('../models/todoModels').UserData;
const JWT = require('../helperServices/decodeJWT.js');

module.exports.storeTodos = (req, res) => {

const data = req.body;
    
 JWT.decode(req.token, (email) => {

    if(data === '' || data === null || typeOf(data) === 'undefined') {
        return res.status(422).json({
            message: 'mandatory parameter missing'
        });
 }

UserData.update({email:email},{email:email, todos: data.todos},{upsert: true}, (err, updateObj) => {
    if (err) {
        console.log(err);
        return res.status(500).json({
            message: 'error'
        });
    }
    return res.status(200).json({
        message: 'success'
    });
  });

 });
  
 } // end of store todos
