'use strict';

const debug = require('debug')('restServ:reservation-mock');
const Reservation = require('../../model/reservation.js');

module.exports = function(done){
  debug('reservation-router');
  new Reservation({time: new Date('1.1.17')}).save()
  .then(reservation => {
    this.tempReservation = reservation;
    done();
  })
  .catch(done);
};
