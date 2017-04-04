'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = Schema({
  customerId: {type: Schema.Types.ObjectId, required: true},
  tableId: {type: Schema.Types.ObjectId, required: true},
  time: {type: Date, required: true}
});

const Reservation = module.exports = mongoose.model('reservation', reservationSchema); //eslint-disable-line
