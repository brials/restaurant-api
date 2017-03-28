'use strict';

require('./lib/test-env.js');
const request = require('superagent');
const expect = require('chai').expect;
const awsMocks = require('./lib/aws-mocks.js'); //eslint-disable-line

const userMock = require('./lib/user-mock.js');
const employeeMock = require('./lib/employee-mock.js');
const tableMock = require('./lib/table-mock.js');
const cleanDB = require('./lib/test-remove.js');

const Employee = require('../model/employee.js');

const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;

const url = `http://localhost:${process.env.PORT}`;
const serverToggle = require('./lib/server-toggle.js');
const server = require('../server.js');

const exampleTable = {
  tableNum: 1
};

describe('Table Route Tests', function(){
  before(done => serverToggle.serverOn(server, done));
  after(done => serverToggle.serverOff(server, done));
  afterEach(done => cleanDB(done));
  describe('POST /api/table', function(){
    beforeEach(done => userMock.call(this, done));
    describe('with a valid body and token', () => {
      it('should return a table', done => {
        request.post(`${url}/api/table`)
        .send(exampleTable)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.tableNum).to.be.a('number');
          done();
        });
      });
    });
    describe('with a valid body', () => {
      it('should return a table', done => {
        request.post(`${url}/api/table`)
        .send(exampleTable)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
    describe('with a valid token', () => {
      it('should return a table', done => {
        request.post(`${url}/api/table`)
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
  describe('GET /api/table/:id', function(){
    beforeEach(done => userMock.call(this, done));
    beforeEach(done => employeeMock.call(this, done));
    beforeEach(done => tableMock.call(this, done));
    describe('with a valid id and token', () => {
      it('should return a table', done => {
        request.get(`${url}/api/table/${this.tempTable._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.tableNum).to.be.a('number');
          done();
        });
      });
    });
    describe('with a valid token', () => {
      it('should return a table', done => {
        request.get(`${url}/api/table/wrongId}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('with a valid Id', () => {
      it('should return a table', done => {
        request.get(`${url}/api/table/${this.tempTable._id}}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
  describe('PUT /api/table/:id', function(){
    beforeEach(done => userMock.call(this, done));
    beforeEach(done => employeeMock.call(this, done));
    beforeEach(done => tableMock.call(this, done));
    describe('with a valid id, token, and body', () => {
      it('should return an updated table', done => {
        request.put(`${url}/api/table/${this.tempTable._id}`)
        .send({tableNum: 314})
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.tableNum).to.equal(314);
          done();
        });
      });
    });
    describe('with a valid token, and body', () => {
      it('should return an updated table', done => {
        request.put(`${url}/api/table/badid`)
        .send({tableNum: 314})
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('with a valid id, token', () => {
      it('should return an updated table', done => {
        request.put(`${url}/api/table/${this.tempTable._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('with a valid id, body', () => {
      it('should return an updated table', done => {
        request.put(`${url}/api/table/${this.tempTable._id}`)
        .send({tableNum: 314})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
  describe('PUT /api/employee/:employeeId/addTable/:tableId', function(){
    beforeEach(done => userMock.call(this, done));
    beforeEach(done => employeeMock.call(this, done));
    beforeEach(done => tableMock.call(this, done));
    describe('with 2 valid ids and a token', () => {
      it('should update the array on a employee', done => {
        request.put(`${url}/api/employee/${this.tempEmployee._id}/addTable/${this.tempTable._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.tables.length).to.equal(1);
          done();
        });
      });
    });
    describe('with 2 valid ids', () => {
      it('should update the array on a employee', done => {
        request.put(`${url}/api/employee/${this.tempEmployee._id}/addTable/${this.tempTable._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
    describe('with 1 valid id and a token', () => {
      it('should update the array on a employee', done => {
        request.put(`${url}/api/employee/badid/addTable/${this.tempTable._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('with a different valid id and a token', () => {
      it('should update the array on a employee', done => {
        request.put(`${url}/api/employee/${this.tempEmployee._id}/addTable/badid}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });
  describe('PUT /api/employee/:employeeId/removeTable/:tableId', function(){
    beforeEach(done => userMock.call(this, done));
    beforeEach(done => employeeMock.call(this, done));
    beforeEach(done => tableMock.call(this, done));
    beforeEach(done => {
      this.tempEmployee.tables.push(this.tempTable._id);
      Employee.findByIdAndUpdate(this.tempEmployee._id, this.tempEmployee, {new:true})
      .then(employee => {
        this.tempEmployee = employee;
        done();
      })
      .catch(done);
    });
    describe('with 2 valid ids and tokens', () => {
      it('should return an employee with an empty tables array', done => {
        request.put(`${url}/api/employee/${this.tempEmployee._id}/removeTable/${this.tempTable._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.tables.length).to.equal(0);
          done();
        });
      });
    });
    describe('with 1 valid ids and tokens', () => {
      it('should return an employee with an empty tables array', done => {
        request.put(`${url}/api/employee/badid/removeTable/${this.tempTable._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('with 1 valid ids and tokens', () => {
      it('should return an employee with an empty tables array', done => {
        request.put(`${url}/api/employee/${this.tempEmployee._id}/removeTable/badid`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('with 1 valid ids and tokens', () => {
      it('should return an employee with an empty tables array', done => {
        request.put(`${url}/api/employee/${this.tempEmployee._id}/removeTable/${this.tempTable._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
  describe('Delete /api/employee/:employeeId/table/:tableId', function(){
    beforeEach(done => userMock.call(this, done));
    beforeEach(done => employeeMock.call(this, done));
    beforeEach(done => tableMock.call(this, done));
    beforeEach(done => {
      this.tempEmployee.tables.push(this.tempTable._id);
      Employee.findByIdAndUpdate(this.tempEmployee._id, this.tempEmployee, {new:true})
      .then(employee => {
        this.tempEmployee = employee;
        done();
      })
      .catch(done);
    });
    describe('with 2 valid ids and a token', () => {
      it('should return a 404', done => {
        request.delete(`${url}/api/employee/${this.tempEmployee._id}/table/${this.tempTable._id}`)
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
    describe('with 1 valid id and a token', () => {
      it('should return a 404', done => {
        request.delete(`${url}/api/employee/badid/table/${this.tempTable._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('with 1 valid id and a token', () => {
      it('should return a 404', done => {
        request.delete(`${url}/api/employee/${this.tempEmployee._id}/table/badid`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('with 2 valid id and no token', () => {
      it('should return a 401', done => {
        request.delete(`${url}/api/employee/${this.tempEmployee._id}/table/${this.tempTable._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
});
