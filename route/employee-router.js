'use strict';

const Router = require('express').Router;
const debug = require('debug')('restServ:employee-router');
const createError = require('http-errors');

const jsonParser = require('body-parser').json();
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const Employee = require('../model/employee.js');
const Restaurant = require('../model/restaurant.js');

const employeeRouter = module.exports = Router();

employeeRouter.post('/api/employee', bearerAuth, jsonParser, function(req, res, next){
  debug('POST /api/employee');

  if(!req.body.name) return next(createError(400, 'expected a name'));
  if(!req.body.employeeTitle) return next(createError(400, 'expected a title'));

  new Employee(req.body).save()
  .then(employee => res.json(employee))
  .catch(next);
});

employeeRouter.get('/api/employee/:id', bearerAuth, function(req, res, next){
  debug('GET /api/employee/:id');

  Employee.findById(req.params.id)
  .populate('tables')
  .then(employee => res.json(employee))
  .catch(next);
});

employeeRouter.put('/api/employee/:id', bearerAuth, jsonParser, function(req, res, next){
  debug('PUT /api/employee/:id');

  if(!req.body.name) return next(createError(400, 'expected a nme'));
  if(!req.body.employeeTitle) return next(createError(400, 'expected a title'));

  Employee.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .then(employee => res.json(employee))
  .catch(next);
});

employeeRouter.put('/api/restaurant/:restaurantId/addEmployee/:employeeId', bearerAuth, function(req, res, next){
  debug('/api/restaurant/:restaurantId/addEmployee/:employeeId');

  Restaurant.findByIdAndAddEmployee(req.params.restaurantId, req.params.employeeId)
  .then(restaurant => res.json(restaurant))
  .catch(next);
});

employeeRouter.put('/api/restaurant/:restaurantId/removeEmployee/:employeeId', bearerAuth, function(req, res, next){
  debug('/api/restaurant/:restaurantId/removeEmployee/:employeeId');
  Employee.findById(req.params.employeeId)
  .then(employee => {
    return Restaurant.findByIdAndRemoveEmployee(req.params.restaurantId, employee._id);
  })
  .then(restaurant => res.json(restaurant))
  .catch(next);
});

employeeRouter.delete('/api/employee/:id', bearerAuth, function(req, res, next){
  debug('DELETE /api/employee/:id');
  Employee.findByIdAndRemove(req.params.id)
  .then(() => res.sendStatus(204))
  .catch(next);
});
