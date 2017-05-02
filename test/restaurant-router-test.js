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
    describe('with a valid body', () => {
      it('should return a restaurant', done => {
        request.post(`${url}/api/restaurant`)
        .send(exampleRestaurant)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
    describe('with a valid token and a missing part of the body', () => {
      it('should return a restaurant', done => {
        request.post(`${url}/api/restaurant`)
        .send({name: 'test name', location: 'test location'})
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
  });
  describe('GET /api/restaurant/:id', function(){
    beforeEach(done => mockUser.call(this, done));
    beforeEach(done => mockRestaurant.call(this, done));
    describe('with a valid id and token', () => {
      it('should return a restaurant', done => {
        request.get(`${url}/api/restaurant/${this.tempRestaurant._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.be.a('String');
          expect(res.body.storeHours).to.be.a('String');
          expect(res.body.location).to.be.a('String');
          done();
        });
      });
    });
    describe('with a valid token', () => {
      it('should return a 404', done => {
        request.get(`${url}/api/restaurant/badid`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('with a valid id', () => {
      it('should return a 401', done => {
        request.get(`${url}/api/restaurant/${this.tempRestaurant._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
  describe('GET /api/restaurant', function(){
    beforeEach(done => mockUser.call(this, done));
    beforeEach(done => mockRestaurant.call(this, done));
    describe('with a valid token', () => {
      it('should return an array of restaurants', done => {
        request.get(`${url}/api/restaurant/`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(1);
          expect(res.body[0].name).to.be.a('String');
          expect(res.body[0].storeHours).to.be.a('String');
          expect(res.body[0].location).to.be.a('String');
          done();
        });
      });
    });
    describe('without a valid token', () => {
      it('should return a 401', done => {
        request.get(`${url}/api/restaurant/`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });  
  });
  describe('PUT /api/restaurant/:id', function(){
    beforeEach(done => mockUser.call(this, done));
    beforeEach(done => mockRestaurant.call(this, done));
    describe('With a valid body, id and token', () => {
      it('should return an updated Restaurant', done => {
        request.put(`${url}/api/restaurant/${this.tempRestaurant._id}`)
        .send({name: 'updated name', storeHours: '10AM-5PM', location: 'updated location'})
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('updated name');
          expect(res.body.location).to.equal('updated location');
          expect(res.body.storeHours).to.equal('10AM-5PM');
          done();
        });
      });
    });
    describe('With a valid body and token', () => {
      it('should return an 404', done => {
        request.put(`${url}/api/restaurant/badid`)
        .send({name: 'updated name', storeHours: '10AM-5PM', location: 'updated location'})
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('With a valid id and token', () => {
      it('should return an 400', done => {
        request.put(`${url}/api/restaurant/${this.tempRestaurant._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('With a valid id and token and a partial body', () => {
      it('should return an 400', done => {
        request.put(`${url}/api/restaurant/${this.tempRestaurant._id}`)
        .send({storeHours: '10AM-5PM', location: 'updated location'})
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('With a valid id and body', () => {
      it('should return an 400', done => {
        request.put(`${url}/api/restaurant/${this.tempRestaurant._id}`)
        .send({name: 'updated name', storeHours: '10AM-5PM', location: 'updated location'})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
  describe('DELETE /api/restaurant/:id', function(){
    beforeEach(done => mockUser.call(this, done));
    beforeEach(done => mockRestaurant.call(this, done));
    describe('with a valid id and token', () => {
      it('should return a 204', done => {
        request.delete(`${url}/api/restaurant/${this.tempRestaurant._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(204);
          done();
        });
      });
    });
    describe('with a valid token', () => {
      it('should return a 404', done => {
        request.delete(`${url}/api/restaurant/badid`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('with a valid id ', () => {
      it('should return a 401', done => {
        request.delete(`${url}/api/restaurant/${this.tempRestaurant._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
});
