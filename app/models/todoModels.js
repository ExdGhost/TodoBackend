'use strict';
// const root = require('app-root-path');
const mongoose = require(`../dbServices/dbConn.js`).mongoose;

// TODO models

const todoSchema = mongoose.Schema({
  id: Number,
  title: String,
  complete: Boolean
});

const userDataSchema = mongoose.Schema({
  email : {
    type: String,
    unique: true,
    trim: true
  },
  todos : [todoSchema]
});

module.exports.UserData = mongoose.model('UserData', userDataSchema);  
module.exports.todoSchema = mongoose.model('Todos', todoSchema);
