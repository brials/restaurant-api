'use strict';

const debug = require('debug')('restServ:test-remove');

const User = require('../../model/user.js');

module.exports = function(done){
  debug('test-remove');
  Promise.all([
    User.remove({})
  ])
  .then(() => done())
  .catch(done);
};
