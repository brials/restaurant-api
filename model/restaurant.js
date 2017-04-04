'use strict';

const debug = require('debug')('restServ:restaurant');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = Schema({
  name: {type: String, required: true},
  storeHours: {type: String, required: true},
  location: {type: String, required: true},
  employees: [{type: Schema.Types.ObjectId, ref: 'employee'}],
  customers: [{type: Schema.Types.ObjectId, ref: 'customers'}],
  menuitems: [{type: Schema.Types.ObjectId, ref: 'menuitem'}]
});

const Restaurant = module.exports = mongoose.mode('restaurant', restaurantSchema);

Restaurant.findByIdAndAddEmployee = function(id, employeeId){
  debug('Restaurant.findByIdAndAddEmployee');

  Restaurant.findById(id)
  .then(restaurant => {
    restaurant.employees.push(employeeId);
  });
  //TODO finish this route after commit
};
