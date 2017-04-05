'use strict';

const debug = require('debug')('restServ:customer');
const createError = require('http-errors');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = Schema({
  tableId: {type: Schema.Types.ObjectId, required: true},
  reservations: [{type: Schema.Types.ObjectId, ref: 'reservation'}],
  menuitems: [{type: Schema.Types.ObjectId, ref: 'menuitem'}],
  arrivalTime: {type: Date, default: Date.now},
  lastVisit: {type: Date, default: Date.now}
});

const Customer = module.exports = mongoose.model('customer', customerSchema);

Customer.findByIdAndAddMenuitem = function(id, menuitemId){
  debug('findByIdAndAddmenuitem');

  return Customer.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(customer => {
    customer.menuitems.push(menuitemId);
    return Customer.findByIdAndUpdate(id, customer, {new: true});
  })
  .then(customer => customer);
};

Customer.findByIdAndRemoveMenuitem = function(id, menuitemId){
  debug('findByIdAndRemoveMenuitem');

  return Customer.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(customer => {
    for(var i = 0; i < customer.menuitems.length; i++){
      if(customer.menuitems[i].toString() == menuitemId){
        customer.menuitems.splice(i, 1);
        break;
      }
    }
    return Customer.findByIdAndUpdate(id, customer, {new:true});
  })
  .then(customer =>customer);
};

Customer.findByIdAndAddReservation = function(id, reservationId){
  debug('findByIdAndAddReservation');

  return Customer.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(customer => {
    customer.reservations.push(reservationId);
    return Customer.findByIdAndUpdate(id, customer, {new: true});
  })
  .then(() => {
    return reservationId;
  });
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
  .then(() => reservationId);
};
