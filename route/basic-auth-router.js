'use strict';

const debug = require('debug')('restServ:basic-auth-router');
const User = require('../model/user.js');
const Router = require('express').Router;
const basicAuth = require('../lib/basic-auth-middleware');
const jsonParser = require('body-parser').json();


const authRouter = module.exports = Router();

authRouter.post('/api/signup', jsonParser, function(req, res, next){
  debug('POST: /api/signup');

  let password = req.body.password;
  delete req.body.password;

  let user = new User(req.body);

  user.generatePasswordHash(password)
  .then(user => user.save())
  .then(user => user.generateToken())
  .then(token => res.send(token))
  .catch(next);
});

authRouter.get('/api/signin/', basicAuth, function(req, res, next){
  debug('GET: /api/signin');

  User.findOne({username: req.auth.username})
  .then(user => user.comparePasswordHash(req.auth.password))
  .then(user => user.generateToken())
  .then(token => res.send(token))
  .catch(next);
});

authRouter.get('/', function(req, res, next){
  debug('GET: /');

  res.send('WOO I can make an App');
  next();
});
