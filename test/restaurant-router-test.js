'use strict';

require('./lib/test-env.js');
const request = require('superagent');
const expect = require('chai').expect;
const awsMocks = require('./lib/aws-mocks.js'); //eslint-disable-line
const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;

const cleanDB = require('./lib/test-remove.js');
const mockRestaurant = require('./lib/restaurant-mock.js');
const mockUser = require('./lib/user-mock.js');

const url = `http://localhost:${process.env.PORT}`;
const serverToggle = require('./lib/server-toggle.js');
const server = require('../server.js');

const exampleRestaurant = {
  name: 'example name',
  storeHours: '9AM-5PM',
  location: 'West Seattle'
};

describe('Restaurant Router Tests', function(){
  before(done => serverToggle.serverOn(server, done));
  after(done => serverToggle.serverOff(server, done));
  afterEach(done => cleanDB(done));
  describe('POST /api/restaurant', function(){
    beforeEach(done => mockUser.call(this, done));
    describe('with a valid body and token', () => {
      it('should return a restaurant', done => {
        request.post(`${url}/api/restaurant`)
        .send(exampleRestaurant)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('example name');
          expect(res.body.storeHours).to.equal('9AM-5PM');
          expect(res.body.location).to.equal('West Seattle');
          done();
        });
      });
    });
    describe('with a valid token', () => {
      it('should return a restaurant', done => {
        request.post(`${url}/api/restaurant`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('with a valid token', () => {
      it('should return a restaurant', done => {
        request.post(`${url}/api/restaurant`)
        .send(exampleRestaurant)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
});
