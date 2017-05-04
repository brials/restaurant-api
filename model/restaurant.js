'use strict';

const debug = require('debug')('restServ:restaurant');
const createError = require('http-errors');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = Schema({
  name: {type: String, required: true, unique: true},
  storeHours: {type: String, required: true},
  location: {type: String, required: true},
  employees: [{type: Schema.Types.ObjectId, ref: 'employee'}],
  tables: [{type: Schema.Types.ObjectId, ref: 'table'}],
  menuitems: [{type: Schema.Types.ObjectId, ref: 'menuitem'}]
});

const Restaurant = module.exports = mongoose.model('restaurant', restaurantSchema);

Restaurant.findByIdAndAddEmployee = function(id, employeeId){
  debug('Restaurant.findByIdAndAddEmployee');

  return Restaurant.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(restaurant => {
    restaurant.employees.push(employeeId);
    return Restaurant.findByIdAndUpdate(id, restaurant, {new: true});
  })
  .then(restaurant => restaurant);
};

Restaurant.findByIdAndRemoveEmployee = function(id, employeeId){
  debug('Restaurant.findByIdAndRemoveEmployee');

  return Restaurant.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(restaurant => {
    for(var i = 0; i < restaurant.employees.length; i++){
      if(restaurant.employees[i].toString() == employeeId.toString()){
        restaurant.employees.splice(i, 1);
      }
    }
    return Restaurant.findByIdAndUpdate(id, restaurant, {new: true});
  })
  .then(restaurant => restaurant);
};

Restaurant.findByIdAndAddTable = function(id, table){
  debug('Restaurant.findByIdAndAddTable');

  return Restaurant.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(restaurant => {
    restaurant.tables.push(table._id);
    return Restaurant.findByIdAndUpdate(id, restaurant, {new: true});
  })
  .then(() => table);
};

Restaurant.findByIdAndRemoveTable = function(id, tableId){
  debug('Restaurant.findByIdAndRemoveTable');

  return Restaurant.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(restaurant => {
    for(var i = 0; i < restaurant.tables.length; i++){
      if(restaurant.tables[i].toString() == tableId.toString()){
        restaurant.tables.splice(i, 1);
      }
    }
    return Restaurant.findByIdAndUpdate(id, restaurant, {new: true});
  })
  .then(restaurant => restaurant);
};

Restaurant.findByIdAndAddMenuitem = function(id, menuitem){
  debug('Restaurant.findByIdAndAddMenuitem');

  return Restaurant.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(restaurant => {
    restaurant.menuitems.push(menuitem._id);
    return Restaurant.findByIdAndUpdate(id, restaurant, {new: true});
  })
  .then(() => menuitem);
};

Restaurant.findByIdAndRemoveMenuitem = function(id, menuitemId){
  debug('Restaurant.findByIdAndRemoveMenuitem');

  return Restaurant.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(restaurant => {
    for(var i = 0; i < restaurant.menuitems.length; i++){
      if(restaurant.menuitems[i].toString() == menuitemId.toString()){
        restaurant.menuitems.splice(i, 1);
      }
    }
    return Restaurant.findByIdAndUpdate(id, restaurant, {new: true});
  })
  .then(restaurant => restaurant);
};
