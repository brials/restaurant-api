'use strict';

'use strict';

const debug = require('debug')('restServ:customerRouter');
const createError = require('http-errors');
const Router = require('express').Router;

const bodyParser = require('body-parser').json();
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Restaurant = require('../model/restaurant.js');

const restaurantRouter = module.exports = Router();

restaurantRouter.post('/api/restaurant', bearerAuth, bodyParser, function(req, res, next){
  debug('POST /api/restaurant');

  return new Restaurant(req.body).save()
  .then(restaurant => res.json(restaurant))
  .catch(next);
});
