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
        request.post(`${url}/api/reservation/table/${this.tempTable._id}/customer/${this.tempUser._id}`)
        .send(exampleReservation)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.time).to.equal(new Date('1.1.17'));
          done();
        });
      });
    });
  });
});
