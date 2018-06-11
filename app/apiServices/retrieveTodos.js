'use strict';
const typeOf = require('type-of');
 //user data model 
const UserData = require('../models/todoModels').UserData;
const JWT = require('../helperServices/decodeJWT.js');

module.exports.getTodos = (req, res) => {
   
  JWT.decode(req.token , (email) => {

    if(email === '' || email === null || typeOf(email) === 'undefined') {
        return res.status(422).json({
            message: 'mandatory parameter missing'
        });
 }

    UserData.find({email:email}, (err, data) => {  
        if(err) {
            console.log(err);
            return res.status(500).json({
            message: err
            });
        } else if (data.length === 0) {
            return res.status(200).json({
                message: 'Dataset empty',
                todos: []
            });
        } else if(data.length >= 1) {
            return res.status(200).json({
                message: 'Dataset found',
                todos: data[0].todos
            });
        }
   });  

  });

 
}
