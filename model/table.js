'use strict';

const debug = require('debug')('restServ:table');
const createError  = require('http-errors');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Reservation = require('./reservation.js');
const Customer = require('./customer.js');

const tableSchema = Schema({
  tableNum: {type: Number, required: true},
  restaurantId: {type: Schema.Types.ObjectId, required: true},
  customers: [{type: Schema.Types.ObjectId, ref: 'customer' }],
  reservations: [{type: Schema.Types.ObjectId, ref: 'reservation'}]
});

const Table = module.exports = mongoose.model('table', tableSchema);

Table.findByIdAndAddReservation = function(id, reservation){
  debug('findByIdAndAddReservation');

  return Table.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(table => {
    this.tempTable = table;
    return new Reservation(reservation).save();
  })
  .then(reservation => {
    this.tempTable.reservations.push(reservation._id);
    this.tempReservation = reservation;
    return Table.findByIdAndUpdate(id, this.tempTable, {new: true});
  })
  .then(() => {
    return this.tempReservation;
  });
};

Table.findByIdAndRemoveReservation = function(id, reservationId){
  debug('findByIdAndRemoveReservation');

  return Table.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(table => {
    for(var i = 0; i < table.reservations.length; i++){
      if(reservationId.toString() == table.reservations[i]){
        table.reservations.splice(i, 1);
      }
    }
    return Table.findByIdAndUpdate(id, table, {new: true});
  })
  .then(() => {
    return reservationId;
  });
};

Table.findByIdAndAddCustomer = function(id, customer){
  debug('findByIdAndAddCustomer');

  return Table.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(table => {
    this.tempTable = table;
    return new Customer(customer).save();
  })
  .then(customer => {
    this.tempTable.customers.push(customer._id);
    this.tempCustomer = customer;
    return this.tempTable.save();
  })
  .then(() => {
    return this.tempCustomer;
  });
};

Table.findByIdAndRemoveCustomer = function(id, customerId){
  debug('findByIdAndRemoveCustomer');

  return Table.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(table => {
    for(var i = 0; i < table.customers.length; i++){
      if(customerId.toString() == table.customers[i]){
        table.customers.splice(i, 1);
      }
    }
    return Table.findByIdAndUpdate(id, table, {new: true});
  })
  .then(table => {
    return table;
  });
};
