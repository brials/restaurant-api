'use strict';

const AWS = require('aws-sdk-mock');

module.exports = exports = {};

exports.uploadMock = {
  ETag: '"randometag"',
  Location: 'https://mockurl.com/mock.png',
  Key: 'server.png',
  key: 'server.png',
  Bucket: 'restServ-test'
};

AWS.mock('S3', 'upload', function(params, callback){
  if(!params.ACL === 'public-read') {
    return callback(new Error('ACL must be public-read'));
  }
  if(!params.bucket === 'restServ-test'){
    return callback(new Error('bucket must be restServ-test'));
  }

  if(!params.Key){
    return callback(new Error('key required'));
  }
  if(!params.Body){
    return callback(new Error('body required'));
  }
  callback(null, exports.uploadMock);
});
