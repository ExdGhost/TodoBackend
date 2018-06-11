'use strict';
const mongoose = require('mongoose');
const appRoot = require('app-root-path');
const readConfig = require('read-config');
const conStr = readConfig(`${appRoot}/dbConfig.json`).conStr;

// mongo db main connection
mongoose.connect(conStr);

const db1 = mongoose.connection;

db1.on('error', console.error.bind(console, 'connection error:'));
db1.once('open', function() {
  console.log('db - connected');
});

module.exports.db = mongoose.connection;
module.exports.mongoose = mongoose;