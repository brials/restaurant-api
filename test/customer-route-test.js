'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const awsMocks = require('./lib/aws-mocks.js'); //eslint-disable-line
const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;

const cleanDB = require('./lib/test-remove.js');
const mockTable = require('./lib/table-mock.js');
const userMock = require('./lib/user-mock.js');
const customerMock = require('./lib/customer-mock.js');
const restaurantMock = require('./lib/restaurant-mock.js');

const url = `http://localhost:${process.env.PORT}`;
const serverToggle = require('./lib/server-toggle.js');
const server = require('../server.js');

describe('Customer Routes', function(){
  before(done => serverToggle.serverOn(server, done));
  after(done => serverToggle.serverOff(server, done));
  afterEach(done => cleanDB(done));
  describe('POST /api/table/:tableId/customer', function(){
    beforeEach(done => userMock.call(this, done));
    beforeEach(done => restaurantMock.call(this, done));
    beforeEach(done => mockTable.call(this, done));
    describe('with a valid id, body, and token', () => {
      it('should return a customer', done => {
        request.post(`${url}/api/table/${this.tempTable._id}/customer`)
        .send({tableId: this.tempTable._id})
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.tableId).to.equal(this.tempTable._id.toString());
          done();
        });
      });
    });
    describe('with a valid body, and token', () => {
      it('should return a 404', done => {
        request.post(`${url}/api/table/badid/customer`)
        .send({tableId: this.tempTable._id})
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('with a valid id, and body', () => {
      it('should return a 401', done => {
        request.post(`${url}/api/table/${this.tempTable._id}/customer`)
        .send({tableId: this.tempTable._id})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
    describe('with a valid id, and token', () => {
      it('should return a 400', done => {
        request.post(`${url}/api/table/${this.tempTable._id}/customer`)
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
  describe('GET /api/customer/:id', function(){
    beforeEach(done => userMock.call(this, done));
    beforeEach(done => restaurantMock.call(this, done));
    beforeEach(done => mockTable.call(this, done));
    beforeEach(done => customerMock.call(this, done));
    describe('With a valid id and token', () => {
      it('should return a customer.', done => {
        request.get(`${url}/api/customer/${this.tempCustomer._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.tableId).to.equal(this.tempTable._id.toString());
          expect(res.body.menuitems.length).to.equal(0);
          done();
        });
      });
    });
    describe('With a valid token', () => {
      it('should return a 404.', done => {
        request.get(`${url}/api/customer/badid`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('With a valid id', () => {
      it('should return a 401.', done => {
        request.get(`${url}/api/customer/${this.tempCustomer._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
  describe('PUT /api/customer/:id', function(){
    beforeEach(done => userMock.call(this, done));
    beforeEach(done => restaurantMock.call(this, done));
    beforeEach(done => mockTable.call(this, done));
    beforeEach(done => customerMock.call(this, done));
    describe('With a  valid body id and token', () => {
      it('should return an updated customer', done => {
        request.put(`${url}/api/customer/${this.tempCustomer._id}`)
        .send({lastVisit: new Date('2015-03-25T12:00:00Z')})
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.lastVisit.toString()).to.be.a('string');
          done();
        });
      });
    });
    describe('With a  valid id and token', () => {
      it('should return a 400', done => {
        request.put(`${url}/api/customer/${this.tempCustomer._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('With a  valid body and token', () => {
      it('should return a 404', done => {
        request.put(`${url}/api/customer/badid`)
        .send({lastVisit: new Date('2015-03-25T12:00:00Z')})
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('With a  valid body and id', () => {
      it('should return a 401', done => {
        request.put(`${url}/api/customer/${this.tempCustomer._id}`)
        .send({lastVisit: new Date('2015-03-25T12:00:00Z')})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
  describe('DELETE /api/table/:tableId/customer/:id', function(){
    beforeEach(done => userMock.call(this, done));
    beforeEach(done => restaurantMock.call(this, done));
    beforeEach(done => mockTable.call(this, done));
    beforeEach(done => customerMock.call(this, done));
    describe('with 2 valid ids and token', () => {
      it('should return a 204', done => {
        request.delete(`${url}/api/table/${this.tempTable._id}/customer/${this.tempUser._id}`)
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
    describe('with 1 valid ids and token', () => {
      it('should return a 404', done => {
        request.delete(`${url}/api/table/badid/customer/${this.tempUser._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('with 1 valid ids and token', () => {
      it('should return a 404', done => {
        request.delete(`${url}/api/table/${this.tempTable._id}/customer/badid`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('with 2 valid ids', () => {
      it('should return a 401', done => {
        request.delete(`${url}/api/table/${this.tempTable._id}/customer/${this.tempUser._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
});
