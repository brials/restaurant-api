'use strict';

const debug = require('debug')('restServ:basic-auth');
const createError = require('http-errors');

module.exports = function(req, res, next){
  debug('basic=auth');
  var authHeader = req.headers.authorization;
  if(!authHeader){
    return next(createError(401, 'authorization header required'));
  }

  var base64header = authHeader.split('Basic ')[1];
  if(!base64header){
    return next(createError(401, 'Username and Password required'));
  }
  var utf8str = new Buffer(base64header, 'base64').toString();
  var authArr = utf8str.split(':');

  req.auth = {
    username: authArr[0],
    password: authArr[1]
  };

  if(!req.auth.username || !req.auth.password){
    return next(createError(401, 'username and password required'));
  }

  next();
};
