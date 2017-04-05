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
const reservationMock = require('./lib/reservation-mock.js');
const restaurantMock = require('./lib/restaurant-mock.js');

const url = `http://localhost:${process.env.PORT}`;
const serverToggle = require('./lib/server-toggle.js');
const server = require('../server.js');

const exampleReservation = {
  time: new Date('1.1.17')
};

describe('Reservation Routes', function(){
  before(done => serverToggle.serverOn(server, done));
  after(done => serverToggle.serverOff(server, done));
  afterEach(done => cleanDB(done));
  describe('POST /api/reservation/table/:tableId/customer/:customerId', function(){
    beforeEach(done => userMock.call(this, done));
    beforeEach(done => restaurantMock.call(this, done));
    beforeEach(done => mockTable.call(this, done));
    beforeEach(done => customerMock.call(this, done));
    beforeEach(done => {
      exampleReservation.tableId = this.tempTable._id;
      exampleReservation.customerId = this.tempCustomer._id;
      done();
    });
    after(done => {
      delete exampleReservation.customerId;
      delete exampleReservation.tableId;
      done();
    });
    describe('with 2 valid ids, a body, and a token', () => {
      it('should return a reservation', done => {
        request.post(`${url}/api/reservation/table/${this.tempTable._id}/customer/${this.tempCustomer._id}`)
        .send(exampleReservation)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.time).to.ok;
          done();
        });
      });
    });
    describe('with 1 valid ids, a body, and a token', () => {
      it('should return a 404', done => {
        request.post(`${url}/api/reservation/table/badid/customer/${this.tempCustomer._id}`)
        .send(exampleReservation)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('with 1 valid ids 2nd, a body, and a token', () => {
      it('should return a 404', done => {
        request.post(`${url}/api/reservation/table/${this.tempTable._id}/customer/badid`)
        .send(exampleReservation)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('with 2 valid ids, and a token', () => {
      it('should return a 400', done => {
        request.post(`${url}/api/reservation/table/${this.tempTable._id}/customer/${this.tempCustomer._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('with 2 valid ids, an invalid body and a token', () => {
      it('should return a 400', done => {
        request.post(`${url}/api/reservation/table/${this.tempTable._id}/customer/${this.tempCustomer._id}`)
        .send({tableId: this.tempTable._id, customerId: this.tempCustomer._id})
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('with 2 valid ids,and a body', () => {
      it('should return a 400', done => {
        request.post(`${url}/api/reservation/table/${this.tempTable._id}/customer/${this.tempCustomer._id}`)
        .send(exampleReservation)

        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
  describe('GET /api/reservation/:id', function(){
    beforeEach(done => userMock.call(this, done));
    beforeEach(done => restaurantMock.call(this, done));
    beforeEach(done => mockTable.call(this, done));
    beforeEach(done => customerMock.call(this, done));
    beforeEach(done => reservationMock.call(this, done));
    describe('with a valid id and a token', () => {
      it('should return a reservation', done => {
        request.get(`${url}/api/reservation/${this.tempReservation.id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.time).to.be.ok;
          done();
        });
      });
    });
    describe('with a valid token', () => {
      it('should return a 404', done => {
        request.get(`${url}/api/reservation/badid`)
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
        request.get(`${url}/api/reservation/${this.tempReservation.id}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
  describe('PUT /api/reservation/:id', function(){
    beforeEach(done => userMock.call(this, done));
    beforeEach(done => restaurantMock.call(this, done));
    beforeEach(done => mockTable.call(this, done));
    beforeEach(done => customerMock.call(this, done));
    beforeEach(done => reservationMock.call(this, done));
    describe('with a valid id, body and token', () => {
      it('should return an updated reservation', done => {
        request.put(`${url}/api/reservation/${this.tempReservation._id}`)
        .send({time: new Date('3.27.17')})
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.time).to.be.ok;
          done();
        });
      });
    });
    describe('with a valid body and token', () => {
      it('should return an 404', done => {
        request.put(`${url}/api/reservation/badid`)
        .send({time: new Date('3.27.17')})
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('with a valid id and token', () => {
      it('should return a 400', done => {
        request.put(`${url}/api/reservation/${this.tempReservation._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('with a valid id and body', () => {
      it('should return a 401', done => {
        request.put(`${url}/api/reservation/${this.tempReservation._id}`)
        .send({time: new Date('3.27.17')})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
  describe('DELETE /api/reservation/:id', function(){
    beforeEach(done => userMock.call(this, done));
    beforeEach(done => restaurantMock.call(this, done));
    beforeEach(done => mockTable.call(this, done));
    beforeEach(done => customerMock.call(this, done));
    beforeEach(done => reservationMock.call(this, done));
    describe('With a valid id and token', () => {
      it('should return a 204', done => {
        request.delete(`${url}/api/reservation/${this.tempReservation._id}`)
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
    describe('With a valid token', () => {
      it('should return a 404', done => {
        request.delete(`${url}/api/reservation/badid`)
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
      it('should return a 404', done => {
        request.delete(`${url}/api/reservation/${this.tempReservation._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
});
