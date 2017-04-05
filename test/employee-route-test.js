'use strict';

require('./lib/test-env.js');
const request = require('superagent');
const expect = require('chai').expect;
const awsMocks = require('./lib/aws-mocks.js'); //eslint-disable-line
const mongoose = require('mongoose');
const Promise = require('bluebird');

const Restaurant = require('../model/restaurant.js');

const cleanDB = require('./lib/test-remove.js');
const mockEmployee = require('./lib/employee-mock.js');
const mockUser = require('./lib/user-mock.js');
const mockRestaurant = require('./lib/restaurant-mock.js');

const url = `http://localhost:${process.env.PORT}`;
const serverToggle = require('./lib/server-toggle.js');
const server = require('../server.js');

const exampleEmployee = {
  name: 'test name',
  employeeTitle: 'king of sillywalks'
};

const exampleUser = {
  username: 'test user',
  password: 'password',
  email: 'emailtest@email.test'
};

mongoose.promise = Promise;

describe('Employee Route Tests', function(){
  before(done => {
    serverToggle.serverOn(server, done);
  });
  after(done => {
    serverToggle.serverOff(server, done);
  });
  afterEach(done => cleanDB(done));
  describe('POST /api/employee', function(){
    beforeEach(done => mockUser.call(this, done));
    beforeEach(done => {
      exampleEmployee.userId = this.tempUser._id;
      done();
    });
    afterEach(done => {
      delete exampleEmployee.userId;
      done();
    });
    describe('with a valid body', () => {
      it('should return an employee', done => {
        request.post(`${url}/api/employee`)
        .send(exampleEmployee)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('test name');
          expect(res.body.employeeTitle).to.equal('king of sillywalks');
          done();
        });
      });
    });
    describe('with an invalid body', () => {
      it('should return an 400', done => {
        request.post(`${url}/api/employee`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('with an invalid token', () => {
      it('should return an 401', done => {
        request.post(`${url}/api/employee`)
        .send(exampleUser)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
    describe('without a password', () => {
      it('should return an 400', done => {
        request.post(`${url}/api/employee`)
        .send({name: 'name no pass'})
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('without a name', () => {
      it('should return an 400', done => {
        request.post(`${url}/api/employee`)
        .send({password: 'password'})
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
  describe('GET /api/employee/:id', function(){
    beforeEach(done => mockUser.call(this, done));
    beforeEach(done => mockEmployee.call(this, done));
    describe('with a valid id and token', () => {
      it('should return an employee', done => {
        request.get(`${url}/api/employee/${this.tempEmployee._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.be.a('string');
          expect(res.body.employeeTitle).to.be.a('string');
          done();
        });
      });
    });
    describe('with a valid token', () => {
      it('should return an 404', done => {
        request.get(`${url}/api/employee/wrongid`)
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
      it('should return an 401', done => {
        request.get(`${url}/api/employee/$this.tempEmployee._id`)
        .set({
          Authorization: 'wrong'
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
  describe('PUT /api/employee/:id', function(){
    beforeEach(done => mockUser.call(this, done));
    beforeEach(done => mockEmployee.call(this, done));
    describe('with a valid id and token and body', () => {
      it('should return a new employee', done => {
        request.put(`${url}/api/employee/${this.tempEmployee._id}`)
        .send({name:'new name', employeeTitle:'new employeeTitle'})
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('new name');
          expect(res.body.employeeTitle).to.equal('new employeeTitle');
          done();
        });
      });
    });
    describe('with a valid token and body', () => {
      it('should return a 404', done => {
        request.put(`${url}/api/employee/wrongid`)
        .send({name:'new name', employeeTitle:'new employeeTitle'})
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('with a valid id and body', () => {
      it('should return a 401', done => {
        request.put(`${url}/api/employee/${this.tempEmployee._id}`)
        .send({name:'new name', employeeTitle:'new employeeTitle'})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
    describe('with a valid id and token', () => {
      it('should return a 400', done => {
        request.put(`${url}/api/employee/${this.tempEmployee._id}`)
        .send({employeeTitle:'new employeeTitle'})
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('with a valid id and token', () => {
      it('should return a 400', done => {
        request.put(`${url}/api/employee/${this.tempEmployee._id}`)
        .send({name:'new name'})
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
  describe('PUT /api/restaurant/:restaurantId/addEmployee/:employeeId', function(){
    beforeEach(done => mockUser.call(this, done));
    beforeEach(done => mockEmployee.call(this, done));
    beforeEach(done => mockRestaurant.call(this, done));
    describe('With 2 valid ids and a token', () => {
      it('should return an updated restaurant', done => {
        request.put(`${url}/api/restaurant/${this.tempRestaurant._id}/addEmployee/${this.tempEmployee._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.employees.length).to.equal(1);
          done();
        });
      });
    });
    describe('With 1 valid ids and a token', () => {
      it('should return an 404', done => {
        request.put(`${url}/api/restaurant/badid/addEmployee/${this.tempEmployee._id}`)
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
        request.put(`${url}/api/restaurant/${this.tempRestaurant._id}/addEmployee/badid`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('With 2 valid ids', () => {
      it('should return an 401', done => {
        request.put(`${url}/api/restaurant/${this.tempRestaurant._id}/addEmployee/${this.tempEmployee._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
  describe('PUT /api/restaurant/:restaurantId/removeEmployee/:employeeId', function(){
    beforeEach(done => mockUser.call(this, done));
    beforeEach(done => mockEmployee.call(this, done));
    beforeEach(done => mockRestaurant.call(this, done));
    beforeEach(done => {
      this.tempRestaurant.employees.push(this.tempEmployee._id);
      Restaurant.findByIdAndUpdate(this.tempRestaurant._id, this.tempRestaurant, {new:true})
      .then(restaurant => {
        this.tempRestaurant = restaurant;
        done();
      })
      .catch(done);
    });
    describe('With 2 valid ids and a token', () => {
      it('should return an updated restaurant', done => {
        request.put(`${url}/api/restaurant/${this.tempRestaurant._id}/removeEmployee/${this.tempEmployee._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.employees.length).to.equal(0);
          done();
        });
      });
    });
    describe('With 1 valid ids and a token', () => {
      it('should return an 404', done => {
        request.put(`${url}/api/restaurant/badid/removeEmployee/${this.tempEmployee._id}`)
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
        request.put(`${url}/api/restaurant/${this.tempRestaurant._id}/removeEmployee/badid`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('With 2 valid ids', () => {
      it('should return an 401', done => {
        request.put(`${url}/api/restaurant/${this.tempRestaurant._id}/removeEmployee/${this.tempEmployee._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
  describe('DELETE /api/employee/:id', function(){
    beforeEach(done => mockUser.call(this, done));
    beforeEach(done => mockEmployee.call(this, done));
    describe('with a valid id and token', () => {
      it('should return a 204', done => {
        request.delete(`${url}/api/employee/${this.tempEmployee._id}`)
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
        request.delete(`${url}/api/employee/wrongid`)
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
      it('should return a 404', done => {
        request.delete(`${url}/api/employee/${this.tempToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
});
