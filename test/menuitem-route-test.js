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
const mockMenuitem = require('./lib/menuitem-mock.js');
const mockCustomer = require('./lib/customer-mock.js');
const mockTable = require('./lib/table-mock.js');
const Customer = require('../model/customer.js');

const url = `http://localhost:${process.env.PORT}`;
const serverToggle = require('./lib/server-toggle.js');
const server = require('../server.js');

const exampleMenuitem = {
  name: 'test name',
  price: 4
};

describe('Menuitem Router', function(){
  before(done => serverToggle.serverOn(server, done));
  after(done => serverToggle.serverOff(server, done));
  afterEach(done => cleanDB(done));
  describe('POST /api/restaurant/:id/menuitem', function(){
    beforeEach(done => mockUser.call(this, done));
    beforeEach(done => mockRestaurant.call(this, done));
    beforeEach(done => {
      exampleMenuitem.restaurantId = this.tempRestaurant._id;
      done();
    });
    afterEach(done => {
      delete exampleMenuitem.restaurantId;
      done();
    });
    describe('With a valid id body and token', () => {
      it('should return a menuitem', done => {
        request.post(`${url}/api/restaurant/${this.tempRestaurant._id}/menuitem`)
        .send(exampleMenuitem)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test name');
          expect(res.body.price).to.equal(4);
          done();
        });
      });
    });
    describe('With a valid body and token', () => {
      it('should return a 404', done => {
        request.post(`${url}/api/restaurant/badid/menuitem`)
        .send(exampleMenuitem)
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
      it('should return a 400', done => {
        request.post(`${url}/api/restaurant/${this.tempRestaurant._id}/menuitem`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('With a valid id, a partial body and token', () => {
      it('should return a 400', done => {
        request.post(`${url}/api/restaurant/${this.tempRestaurant._id}/menuitem`)
        .send({name: 'only a name'})
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('With a valid id, and a body', () => {
      it('should return a 400', done => {
        request.post(`${url}/api/restaurant/${this.tempRestaurant._id}/menuitem`)
        .send(exampleMenuitem)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
  describe('GET /api/menuitem/:id', function(){
    beforeEach(done => mockUser.call(this, done));
    beforeEach(done => mockRestaurant.call(this, done));
    beforeEach(done => mockMenuitem.call(this, done));
    describe('with a valid id and token', () => {
      it('should return a menuitem', done => {
        request.get(`${url}/api/menuitem/${this.tempMenuitem._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.be.a('String');
          expect(res.body.price).to.be.a('Number');
          done();
        });
      });
    });
    describe('with a valid token', () => {
      it('should return a 404', done => {
        request.get(`${url}/api/menuitem/badid`)
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
        request.get(`${url}/api/menuitem/${this.tempMenuitem._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
  describe('PUT /api/menuitem/:id', function(){
    beforeEach(done => mockUser.call(this, done));
    beforeEach(done => mockRestaurant.call(this, done));
    beforeEach(done => mockMenuitem.call(this, done));
    describe('with a valid id body and token', () => {
      it('should return an updated menuitem', done => {
        request.put(`${url}/api/menuitem/${this.tempMenuitem._id}`)
        .send({name: 'new name', price: 5})
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('new name');
          expect(res.body.price).to.equal(5);
          done();
        });
      });
    });
    describe('with a valid body and token', () => {
      it('should return a 404', done => {
        request.put(`${url}/api/menuitem/badid`)
        .send({name: 'new name', price: 5})
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
        request.put(`${url}/api/menuitem/${this.tempMenuitem._id}`)
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
      it('should return a 400', done => {
        request.put(`${url}/api/menuitem/${this.tempMenuitem._id}`)
        .send({name: 'new name', price: 5})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
  describe('PUT /api/customer/:customerId/addMenuitem/:menuitemId', function(){
    beforeEach(done => mockUser.call(this, done));
    beforeEach(done => mockRestaurant.call(this, done));
    beforeEach(done => mockMenuitem.call(this, done));
    beforeEach(done => mockTable.call(this, done));
    beforeEach(done => mockCustomer.call(this, done));
    describe('with 2 valid ids and a token', () => {
      it('should return an updated customer', done => {
        request.put(`${url}/api/customer/${this.tempCustomer._id}/addMenuitem/${this.tempMenuitem._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.menuitems.length).to.equal(1);
          done();
        });
      });
    });
    describe('with 1 valid ids and a token', () => {
      it('should return an 404', done => {
        request.put(`${url}/api/customer/badid/addMenuitem/${this.tempMenuitem._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('with 1 valid ids and a token', () => {
      it('should return an 404', done => {
        request.put(`${url}/api/customer/${this.tempCustomer._id}/addMenuitem/badid`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('with 1 valid ids and a token', () => {
      it('should return an 401', done => {
        request.put(`${url}/api/customer/${this.tempCustomer._id}/addMenuitem/${this.tempMenuitem._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
  describe('PUT /api/customer/:customerId/removeMenuitem/:menuitemId', function(){
    beforeEach(done => mockUser.call(this, done));
    beforeEach(done => mockRestaurant.call(this, done));
    beforeEach(done => mockMenuitem.call(this, done));
    beforeEach(done => mockTable.call(this, done));
    beforeEach(done => mockCustomer.call(this, done));
    beforeEach(done => {
      this.tempCustomer.menuitems.push(this.tempMenuitem._id);
      Customer.findByIdAndUpdate(this.tempCustomer._id, this.tempCustomer, {new: true})
      .then(customer => {
        this.tempCustomer = customer;
        done();
      })
      .catch(done);
    });
    describe('With 2 valid ids and a token', () => {
      it('should return an updated customer', done => {
        request.put(`${url}/api/customer/${this.tempCustomer._id}/removeMenuitem/${this.tempMenuitem._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.menuitems.length).to.equal(0);
          done();
        });
      });
    });
    describe('With 1 valid ids and a token', () => {
      it('should return an 404', done => {
        request.put(`${url}/api/customer/badid/removeMenuitem/${this.tempMenuitem._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('With 1 valid ids and a token', () => {
      it('should return an 404', done => {
        request.put(`${url}/api/customer/${this.tempCustomer._id}/removeMenuitem/badid`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('With 1 valid ids and a token', () => {
      it('should return an 401', done => {
        request.put(`${url}/api/customer/${this.tempCustomer._id}/removeMenuitem/${this.tempMenuitem._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
  describe('DELETE /api/restaurant/:restaurantId/menuitem/:menuitemId', function(){
    beforeEach(done => mockUser.call(this, done));
    beforeEach(done => mockRestaurant.call(this, done));
    beforeEach(done => mockMenuitem.call(this, done));
    describe('with 2 valid ids and a token', () => {
      it('should return a 204', done => {
        request.delete(`${url}/api/restaurant/${this.tempRestaurant._id}/menuitem/${this.tempMenuitem._id}`)
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
    describe('with 1 valid ids and a token', () => {
      it('should return a 404', done => {
        request.delete(`${url}/api/restaurant/badid/menuitem/${this.tempMenuitem._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('with 1 valid ids and a token', () => {
      it('should return a 404', done => {
        request.delete(`${url}/api/restaurant/${this.tempRestaurant._id}/menuitem/badid`)
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
        request.delete(`${url}/api/restaurant/${this.tempRestaurant._id}/menuitem/${this.tempMenuitem._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
});
