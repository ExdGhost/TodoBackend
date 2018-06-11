'use strict';

const express = require('express');
const expressJwt = require('express-jwt');
const bodyParser = require('body-parser');
const appRoot = require('app-root-path');
const fs = require('fs');
const bearerToken = require('express-bearer-token');
const reg = require('./apiServices/register');
const log = require('./apiServices/login');
const store = require('./apiServices/storeTodos');
const retrieve = require('./apiServices/retrieveTodos');


//INIT APP SERVER
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bearerToken()); //extracts bearer token and puts it in req.token

// CORS HEADERS
app.use((req, res, next) => {

  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST',
    'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
  });

  next();

});

// Read public key
const RSA_PUBLIC_KEY = fs.readFileSync(`${appRoot}/public.key`,'utf8');

// USING MIDDLEWARE SERVICE TO CHECK AUTHENTICATION
  // automatically checks expiry of the token also if expiresIn field is set
const checkIfAuthenticated = expressJwt({
  secret: RSA_PUBLIC_KEY
});

app.post('/services/register', (req, res) => {
  reg.register(req, res);
});

app.get('/services/login', (req, res) => {
  log.login(req, res);
});

//AUTHENTICATED API's //////////////////////////
app.get('/services/getTodos', checkIfAuthenticated, (req, res) => {
  if(!req.user.email) {
    return res.status(401).json({
      message: 'Invalid token'
    });
  } else {
    retrieve.getTodos(req, res);
  }
});

app.post('/services/storeTodos', checkIfAuthenticated, (req,res) => {
  if(!req.user.email) {
    return res.status(401).json({
      message: 'Invalid token'
    });
  } else {
    store.storeTodos(req, res);
  }
});
//////////////////////////////////////////////

app.listen(process.env.PORT || 8080, () => {
  console.log('ToDo Backend is up & listening');
});