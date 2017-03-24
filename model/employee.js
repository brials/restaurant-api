'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('restServ:employee');
const createError = require('http-errors');

const Table = require('./table.js');

const employeeSchema = Schema({
  name: { type: String, required: true},
  employeeTitle: { type: String, required: true},
  hoursLogged: {type: Number},
  userId: {type: Schema.Types.ObjectId, required: true},
  tables: [{type: Schema.Types.ObjectId, ref: 'table'}]
});

const Employee = module.exports = mongoose.model('employee', employeeSchema);

Employee.findByIdAndAddTable = function(id, table){
  debug('findByIdAndAddPost');

  return Employee.findById(id)
  .catch(err => Promise.reject(createError(404, err.message)))
  .then(employee => {
    this.tempEmployee = employee;
    return new Table(table).save();
  })
  .then(table => {
    this.tempEmployee.tables.push(table._id);
    this.tempTable = table;
    return this.tempEmployee.save();
  })
  .then(() => {
    return this.tempTable;
  });
};

Employee.findByIdAndRemoveTable = function(id, tableId){
  debug('findByIdAndRemovePost');
  Employee.findById(id)
  .then(employee => {
    for(var i = 0; i < employee.tables.length; i++){
      if(employee.table[i] == tableId){
        employee.table.splice(i, 1);
      }
    }
    return Employee.findByIdAndUpdate(id, employee, {new: true});
  })
  .then(() => {
    return tableId;
  })
  .catch(err => Promise.reject(createError(404, err.message)));
};
