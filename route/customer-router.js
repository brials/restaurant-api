'use strict';

const debug = require('debug')('restServ:customerRouter');
const createError = require('http-errors');
const Router = require('express').Router;

const bodyParser = require('body-parser').json();
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Table = require('../model/table.js');
const Customer = require('../model/customer.js');

const customerRouter = module.exports = Router();

customerRouter.post('/api/table/:tableId/customer', bearerAuth, bodyParser, function(req, res, next){
  debug('POST /api/table/:tableId/customer');

  Table.findByIdAndAddCustomer(req.params.tableId, req.body)
  .then(customer => res.json(customer))
  .catch(next);
});

customerRouter.get('/api/customer/:id', bearerAuth, function(req, res, next){
  debug('GET /api/customer/:id');

  Customer.findById(req.params.id)
  .populate('reservations')
  .populate('menuitems')
  .then(customer => res.json(customer))
  .catch(next);
});

customerRouter.get('/api/customer', bearerAuth, function(req, res, next){
  debug('GET /api/customer');

  Customer.find({})
  .populate('reservations')
  .populate('menuitems')
  .then(customer => res.json(customer))
  .catch(next);
});

customerRouter.put('/api/customer/:id', bearerAuth, bodyParser, function(req, res, next){
  debug('PUT /api/customer/:id');

  if(!req.body.lastVisit && !req.body.reservationId) return next(createError(400, 'need a body'));

  Customer.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(customer => res.json(customer))
  .catch(next);
});

customerRouter.delete('/api/table/:tableId/customer/:id', bearerAuth, function(req, res, next){
  debug('DELETE /api/table/:tableId/customer/:id');
  Table.findByIdAndRemoveCustomer(req.params.tableId, req.params.id)
  .then(() => {
    return Customer.findByIdAndRemove(req.params.id);
  })
  .then(() => {
    res.sendStatus(204);
  })
  .catch(next);
});
