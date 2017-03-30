'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('restServ:employee');
const createError = require('http-errors');

const employeeSchema = Schema({
  name: {type: String, required: true},
  employeeTitle: {type: String, required: true},
  hoursLogged: {type: Number},
  userId: {type: Schema.Types.ObjectId, required: true},
  tables: [{type: Schema.Types.ObjectId, ref: 'table'}]
});

const Employee = module.exports = mongoose.model('employee', employeeSchema);

Employee.findByIdAndAddTable = function(id, tableId){
  debug('findByIdAndAddTable');

  return Employee.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(employee => {
    employee.tables.push(tableId);
    return Employee.findByIdAndUpdate(id, employee, {new: true});
  })
  .then(employee => {
    return employee;
  });
};

Employee.findByIdAndRemoveTable = function(id, tableId){
  debug('findByIdAndRemoveTable');
  return Employee.findById(id)
  .then(employee => {
    for(var i = 0; i < employee.tables.length; i++){
      if(employee.tables[i] == tableId.toString()){
        employee.tables.splice(i, 1);
      }
    }
    return Employee.findByIdAndUpdate(employee._id, employee, {new: true});
  })
  .then(employee => {
    return employee;
  })
  .catch(err => Promise.reject(createError(404, err.message)));
};
