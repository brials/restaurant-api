'use strict';

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Promise = require('bluebird'); //eslint-disable-line
const debug = require('debug')('restServ:server');

const errors = require('./lib/error-middleware.js');
const basicAuthRouter = require('./route/basic-auth-router.js');
const employeeRouter = require('./route/employee-router.js');

dotenv.load();

const PORT = process.env.PORT || 3000;
const app = express();

mongoose.connect(process.env.MONGODB_URI);

let morganFormat = process.env.PRODUCTION ? 'common:' : 'dev';

app.use(cors());
app.use(morgan(morganFormat));
app.use(employeeRouter);
app.use(basicAuthRouter);
app.use(errors);

const server = module.exports = app.listen(PORT, () => {
  debug(`server is up: ${PORT}`);
});

server.isRunning = true;
