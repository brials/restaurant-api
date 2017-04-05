'use strict';


require('./lib/test-env.js');
require('./lib/aws-mocks.js');
const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const mockUser = require('./lib/user-mock.js');
const User = require('../model/user.js');
const cleanDB = require('./lib/test-remove.js');
mongoose.Promise = Promise;

const serverToggle = require('./lib/server-toggle.js');
const server = require('../server.js');
const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'test user',
  password: 'test password',
  email: 'exampleEmail@example.email'
};

describe('USER TESTS', function(){
  before(done => serverToggle.serverOn(server, done));
  after(done => serverToggle.serverOff(server, done));
  afterEach(done => cleanDB(done));
  describe('GET /', function(){
    describe('testing basic route', function(){
      it('should return some text', done => {
        request.get(`${url}/`)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.text).to.equal('WOO I can make an App');
          done();
        });
      });
    });
  });
  describe('POST /api/signup', function(){
    describe('with a valid body', function(){
      it('should return a token', done => {
        request.post(`${url}/api/signup`)
        .send(exampleUser)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    });
    describe('with an invalid body', function(){
      it('should return a 400', done => {
        request.post(`${url}/api/signup`)
        .send({username:'name', password:'pass'})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    describe('with a taken username body', function(){
      before(done => {
        new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then(user => user.save())
        .then(() => done())
        .catch(done);
      });
      it('should return a 500 MongoError', done => {
        request.post(`${url}/api/signup`)
        .send(exampleUser)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          done();
        });
      });
    });
  });
  describe('GET /api/signin', function(){
    beforeEach(done => mockUser.call(this, done));
    describe('with a valid body', () => {
      it('should return a token', done => {
        request.get(`${url}/api/signin`)
        .auth(this.tempUser.username, this.tempPassword)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    });
    describe('without a password', () => {
      it('should return a 401', done => {
        request.get(`${url}/api/signin`)
        .auth(this.tempUser.username)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
    describe('without a valid username', () => {
      it('should return a 500', done => {
        request.get(`${url}/api/signin`)
        .auth('bob', this.tempPassword)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          done();
        });
      });
    });
    describe('without an auth header', () => {
      it('should return a 401', done => {
        request.get(`${url}/api/signin`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });
});
