'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('restServ:employee');
const createError = require('http-errors');

const employeeSchema = Schema({
  name: { type: String, required: true},
  employeeTitle: { type: String, required: true},
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
  Employee.findById(id)
  .then(employee => {
    console.log('in findbyand Remove');
    for(var i = 0; i < employee.tables.length; i++){
      if(employee.table[i] == tableId){
        employee.table.splice(i, 1);
        console.log('removal happened');
      }
    }
    return Employee.findByIdAndUpdate(id, employee, {new: true});
  })
  .then(employee => {
    console.log('in find by id and removeTable');
    return employee;
  })
  .catch(err => Promise.reject(createError(404, err.message)));
};
