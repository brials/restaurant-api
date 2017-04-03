'use strict';

const debug = require('debug')('restServ:reservation-router');
const Router = require('express').Router;

const bodyParser = require('body-parser').json();
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const Table = require('../model/table.js');
const Customer = require('../model/customer.js');

const reservationRouter = module.exports = Router();

reservationRouter.post('/api/reservation/table/:tableId/customer/:customerId', bearerAuth, bodyParser, function(req, res, next){
  debug('POST /api/reservation/table/:tableId/customer/:customerId/reservation/:reservationId');

  Table.findByIdAndAddReservation(req.params.tableId, req.body)
  .then(reservation => {
    console.log('after the findByandAddRes', this ,reservation)
    this.tempReservation = reservation;
    Customer.findByIdAndAddReservation(req.params.customId, reservation._id);
  })
  .then(() => res.json(this.tempReservation))
  .catch(next);
});
