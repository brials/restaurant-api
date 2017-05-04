'use strict';

const debug = require('debug')('restServ:customer-mock');
const Customer = require('../../model/customer.js');
const lorem = require('lorem-ipsum');

module.exports = function(done){
  debug('customer-mock');
  var name = lorem({count: 2, units: 'word'}).split(' ').join('-');
  new Customer({name: name, tableId: this.tempTable._id}).save()
  .then(customer => {
    this.tempCustomer = customer;
    done();
  })
  .catch(done);
};
