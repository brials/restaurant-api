'use strict';

const debug = require('debug')('restServ:menuitem-mock');
const Menuitem = require('../../model/menuitem.js');
const lorem = require('lorem-ipsum');

module.exports = function(done){
  debug('menuitem-mock');

  var name = lorem({count: 2, units: 'word'}).split(' ').join('-');
  var price = Math.floor(Math.random() * 100);
  let exampleMenuitem = {
    name,
    price,
    restaurantId: this.tempRestaurant._id
  };
  new Menuitem(exampleMenuitem).save()
  .then(menuitem => {
    this.tempMenuitem = menuitem;
    done();
  })
  .catch(done);
};
