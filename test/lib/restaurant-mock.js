'use strict';

const debug = require('debug')('restServ:restaurant-mock');
const Restaurant = require('../../model/restaurant.js');
const lorem = require('lorem-ipsum');

module.exports = function(done){
  debug('restaurant-mock');

  var name = lorem({count: 2, units: 'word'}).split(' ').join('-');
  var storeHours = lorem({count: 2, units: 'word'}).split(' ').join('-');
  var location = lorem({count: 2, units: 'word'}).split(' ').join('-');
  let exampleRestaurant = {
    name,
    storeHours,
    location
  };
  new Restaurant(exampleRestaurant).save()
  .then(restaurant => {
    this.tempRestaurant = restaurant;
    done();
  })
  .catch(done);
};
