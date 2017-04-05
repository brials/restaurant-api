'use strict';

const debug = require('debug')('restServ:test-remove');

const User = require('../../model/user.js');
const Employee = require('../../model/employee.js');
const Table = require('../../model/table.js');
const Customer = require('../../model/customer.js');
const Reservation = require('../../model/reservation.js');
const Restaurant = require('../../model/restaurant.js');
const Menuitem = require('../../model/menuItem.js');

module.exports = function(done){
  debug('test-remove');
  Promise.all([
    User.remove({}),
    Employee.remove({}),
    Table.remove({}),
    Customer.remove({}),
    Reservation.remove({}),
    Restaurant.remove({}),
    Menuitem.remove({})
  ])
  .then(() => done())
  .catch(done);
};
