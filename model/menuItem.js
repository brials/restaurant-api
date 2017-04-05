'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuitemSchema = Schema({
  name: {type: String, required: true},
  price: {type: Number, required: true},
  restaurantId: {type: Schema.Types.ObjectId}
});

module.exports = mongoose.model('menuitem', menuitemSchema);
