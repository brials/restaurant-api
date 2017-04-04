'use strict';

const debug = require('debug')('restServ:reservation-router');
const createError = require('http-errors');
const Router = require('express').Router;

const bodyParser = require('body-parser').json();
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const Table = require('../model/table.js');
const Customer = require('../model/customer.js');
const Reservation = require('../model/reservation.js');

const reservationRouter = module.exports = Router();

reservationRouter.post('/api/reservation/table/:tableId/customer/:customerId', bearerAuth, bodyParser, function(req, res, next){
  debug('POST /api/reservation/table/:tableId/customer/:customerId');
  if(!req.body.time) return next(createError(400, 'expected a time'));

  Table.findByIdAndAddReservation(req.params.tableId, req.body)
  .then(reservation => {
    return Customer.findByIdAndAddReservation(req.params.customerId, reservation._id);
  })
  .then(reservationId => {
    return Reservation.findById(reservationId);
  })
  .then(reservation => {
    res.json(reservation);
  })
  .catch(next);
});

reservationRouter.get('/api/reservation/:id', bearerAuth, function(req, res, next){
  debug('POST /api/reservation/:id');

  Reservation.findById(req.params.id)
  .then(reservation => res.json(reservation))
  .catch(next);
});

reservationRouter.put('/api/reservation/:id', bearerAuth, bodyParser, function(req, res, next){
  debug('PUT /api/reservation/:id');

  if(!req.body.time) return next(createError(400, 'expected a time'));


  Reservation.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(reservation => res.json(reservation))
  .catch(next);
});

reservationRouter.delete('/api/reservation/:id', bearerAuth, function(req, res, next){
  debug('DELETE /api/reservation/:id');

  Reservation.findById(req.params.id)
  .then(reservation => {
    return Table.findByIdAndRemoveReservation(reservation.tableId, req.params.id);
  })
  .then(reservationId => {
    return Reservation.findById(reservationId);
  })
  .then(reservation => {
    return Customer.findByIdAndRemoveReservation(reservation.customerId, reservation._id);
  })
  .then(reservationId => {
    return Reservation.findByIdAndRemove(reservationId);
  })
  .then(() => res.sendStatus(204))
  .catch(next);
});
