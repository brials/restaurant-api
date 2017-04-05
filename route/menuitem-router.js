'use strict';

const debug = require('debug')('restServ:menuitemRouter');
const createError = require('http-errors');
const Router = require('express').Router;

const bodyParser = require('body-parser').json();
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Menuitem = require('../model/menuItem.js');
const Restaurant = require('../model/restaurant.js');
const Customer = require('../model/customer.js');

const menuitemRouter = module.exports = Router();

menuitemRouter.post('/api/restaurant/:id/menuitem', bearerAuth, bodyParser, function(req, res, next){
  debug('POST api/restaurant/:id/menuitem');

  if(!req.body.name || !req.body.price) return next(createError(400, 'Request requires a name and a body.'));
  new Menuitem(req.body).save()
  .then(menuitem => {
    return Restaurant.findByIdAndAddMenuitem(req.params.id, menuitem);
  })
  .then(menuitem => res.json(menuitem))
  .catch(next);
});

menuitemRouter.get('/api/menuitem/:id', bearerAuth, function(req, res, next){
  debug('GET /api/menuitem/:id');

  Menuitem.findById(req.params.id)
  .then(menuitem => res.json(menuitem))
  .catch(next);
});

menuitemRouter.put('/api/menuitem/:id', bearerAuth, bodyParser, function(req, res, next){
  debug('PUT /api/menuitem/:id');

  if(!req.body.name || !req.body.price) return next(createError(400, 'Request requires a name and a body.'));
  Menuitem.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .then(menuitem => res.json(menuitem))
  .catch(next);
});

menuitemRouter.put('/api/customer/:customerId/addMenuitem/:menuitemId', bearerAuth, function(req, res, next){
  debug('PUT /api/customer/:customerId/addMenuitem/:menuitemId');

  Customer.findByIdAndAddMenuitem(req.params.customerId, req.params.menuitemId)
  .then(customer => res.json(customer))
  .catch(next);
});

menuitemRouter.put('/api/customer/:customerId/removeMenuitem/:menuitemId', bearerAuth, function(req, res, next){
  debug('PUT /api/customer/:customerId/removeMenuitem/:menuitemId');

  return Menuitem.findById(req.params.menuitemId)
  .then(menuitem => {
    return Customer.findByIdAndRemoveMenuitem(req.params.customerId, menuitem._id);
  })
  .then(customer => res.json(customer))
  .catch(next);
});

menuitemRouter.delete('/api/restaurant/:restaurantId/menuitem/:id', bearerAuth, function(req, res, next){
  debug('DELETE /api/restaurant/:restaurantId/menuitem/:id');

  Restaurant.findByIdAndRemoveMenuitem(req.params.restaurantId, req.params.id)
  .then(() => {
    return Menuitem.findByIdAndRemove(req.params.id);
  })
  .then(() => res.sendStatus(204))
  .catch(next);
});
