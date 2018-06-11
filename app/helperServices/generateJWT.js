'use strict'

const fs = require('fs');
const jwt =  require('jsonwebtoken');
const appRoot = require('app-root-path');
const readConfig = require('read-config');
const config = readConfig(`${appRoot}/config.json`);


module.exports.generate = (email, callback) => {

const exp = config.exp;
const issu= config.issuer;
const sub = config.subject;
const aud = config.audience;

const RSA_PRIVATE_KEY = fs.readFileSync(`${appRoot}/private.key`,'utf8');

const payload = {email: email};

    const signOptions = {
    issuer: issu,
    subject: sub, 
    audience: aud,
    expiresIn: exp,
    algorithm: 'RS256'
    }
    
    const token = jwt.sign(payload,RSA_PRIVATE_KEY,signOptions);

    return callback(token, exp);
}