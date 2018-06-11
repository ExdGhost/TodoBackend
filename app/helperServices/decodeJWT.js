'use strict'

const fs = require('fs');
const jwt =  require('jsonwebtoken');
const appRoot = require('app-root-path');
const readConfig = require('read-config');
const config = readConfig(`${appRoot}/config.json`);


module.exports.decode = (token, callback) => {

const RSA_PUBLIC_KEY = fs.readFileSync(`${appRoot}/public.key`,'utf8');

    // extract email from token payload

    const decoded = jwt.decode(token, {complete: true});
     
    return callback(decoded.payload.email);
}