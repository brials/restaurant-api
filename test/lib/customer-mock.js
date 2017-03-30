'use strict';

const debug = require('debug')('restServ:customer-mock');
const Customer = require('../../model/customer.js');

module.exports = function(done){
  debug('customer-mock');
  new Customer({tableId: this.tempTable._id}).save()
  .then(customer => {
    this.tempCustomer = customer;
    done();
  })
  .catch(done);
};
