'use strict';

const debug = require('debug')('restServ:restaurantRouter');
const createError = require('http-errors');
const Router = require('express').Router;

const bodyParser = require('body-parser').json();
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Restaurant = require('../model/restaurant.js');

const restaurantRouter = module.exports = Router();

restaurantRouter.post('/api/restaurant', bearerAuth, bodyParser, function(req, res, next){
  debug('POST /api/restaurant');

  if(!req.body.name || !req.body.storeHours || !req.body.location) return next(createError(400, 'need a name, location and storeHours'));
  return new Restaurant(req.body).save()
  .then(restaurant => res.json(restaurant))
  .catch(next);
});

restaurantRouter.get('/api/restaurant/:id', bearerAuth, function(req, res, next){
  debug('GET /api/restaurant/:id');

  Restaurant.findById(req.params.id)
  .populate('employees')
  .populate('tables')
  .populate('menuitems')
  .then(restaurant => res.json(restaurant))
  .catch(next);
});

restaurantRouter.put('/api/restaurant/:id', bearerAuth, bodyParser, function(req, res, next){
  debug('PUT /api/restaurant/:id');

  if(!req.body.name || !req.body.storeHours || !req.body.location) return next(createError(400, 'need a name, location and storeHours'));
  Restaurant.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .then(restaurant => res.json(restaurant))
  .catch(next);
});

restaurantRouter.delete('/api/restaurant/:id', bearerAuth, function(req, res, next){
  debug('DELETE /api/restaurant/:id');

  Restaurant.findByIdAndRemove(req.params.id)
  .then(() => res.sendStatus(204))
  .catch(next);
});
