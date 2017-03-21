
'use strict';

//code modified from bnation slugram repo

const debug = require('debug')('sulgram:restServ-user-mock');
const User = require('../../model/user.js');
const lorem = require('lorem-ipsum');

module.exports = function(done){
  debug('create mock user');
  var username = lorem({count: 2, units: 'word'}).split(' ').join('-');
  var password = lorem({count: 2, units: 'word'}).split(' ').join('-');
  var email= lorem({count: 2, units: 'word'}).split(' ').join('-');
  var exampleUser = {
    username,
    password,
    email: `${email}@slug.slug`,
  };
  this.tempPassword = password;
  new User(exampleUser)
  .generatePasswordHash(exampleUser.password)
  .then( user => user.save())
  .then( user => {
    this.tempUser = user;
    return user.generateToken();
  })
  .then( token => {
    this.tempToken = token;
    done();
  })
  .catch(done);
};
