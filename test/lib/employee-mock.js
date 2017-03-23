'use strict';

const debug = require('debug')('restServ:employee-mock');
const Employee = require('../../model/employee.js');
const lorem = require('lorem-ipsum');

module.exports = function(done){
  debug('create mock Employee');
  var name = lorem({count: 2, units: 'word'}).split(' ').join('-');
  var employeeTitle = lorem({count: 2, units: 'word'}).split(' ').join('-');
  var exampleEmployee = {
    name,
    employeeTitle,
    userId: this.tempUser._id
  };
  new Employee(exampleEmployee).save()
  .then(employee => {
    this.tempEmployee = employee;
    done();
  })
  .catch(done);
};
