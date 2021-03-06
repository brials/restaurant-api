'use strict';

const debug = require('debug')('restServ:server-toggle');

module.exports = exports = {};

exports.serverOn = function(server, done){
  if(!server.isRunning){
    server.listen(process.env.PORT, () => {
      server.isRunning = true;
      debug('Server up!');
      done();
    });
    return;
  }
  done();
};

exports.serverOff = function(server, done){
  if(server.isRunning) {
    server.close(err => { //eslint-disable-line
      server.isRunning = false;
      debug('server down!');
      done();
    });
    return;
  }
  done();
};
