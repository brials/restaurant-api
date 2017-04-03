'use strict';

const debug = require('debug')('restServ:customer');
const createError = require('http-errors');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = Schema({
  tableId: {type: Schema.Types.ObjectId, required: true},
  reservations: [{type: Schema.Types.ObjectId, ref: 'reservation'}],
  menuItems: [{type: Schema.Types.ObjectId, ref: 'menuItem'}],
  arrivalTime: {type: Date, default: Date.now},
  lastVisit: {type: Date, default: Date.now}
});

const Customer = module.exports = mongoose.model('customer', customerSchema);

Customer.findByIdAndAddMenuItem = function(id, menuItemId){
  debug('findByIdAndAddMenuItem');

  Customer.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(customer => {
    customer.menuItems.push(menuItemId);
    return Customer.findByIdAndUpdate(id, customer, {new: true});
  })
  .then(customer => customer);
};

Customer.findByIdAndRemoveMenuItem = function(id, menuItemId){
  debug('findByIdAndRemoveMenuItem');

  Customer.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(customer => {
    for(var i = 0; i < customer.menuItems.length; i++){
      if(customer.menuItems[i] == menuItemId.toString()){
        customer.menuItems.splice(i, 1);
      }
    }
    return Customer.findByIdAndUpdate(id, customer, {new:true});
  })
  .then(customer => customer);
};

Customer.findByIdAndAddReservation = function(id, reservationId){
  debug('findByIdAndAddReservation');

  Customer.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(customer => {
    customer.reservations.push(reservationId);
    return Customer.findByIdAndUpdate(id, customer, {new: true});
  })
  .then(customer => customer);
};

Customer.findByIdAndRemoveReservation = function(id, reservationId){
  debug('findByIdAndRemoveReservation');

  Customer.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(customer => {
    for(var i = 0; i < customer.reservations.length; i++){
      if(customer.reservations[i] == reservationId.toString()){
        customer.reservations.splice(i, 1);
      }
    }
    return Customer.findByIdAndUpdate(id, customer, {new:true});
  })
  .then(customer => customer);
};
