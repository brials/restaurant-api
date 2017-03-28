'use strict';

const debug = require('debug')('restServ:table-mock');

const Table = require('../../model/table.js');

module.exports = function(done){
  debug('mock-user');

  var rand = Math.random() * 1000;

  new Table({tableNum: rand}).save()
  .then(table => {
    this.tempTable = table;
    done();
  })
  .catch(done);
};
