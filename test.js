/**
 * Created by solee on 7/16/16.
 */
'use strict';

var easemob = require('./index');
var co = require('co');
var should = require('chai').should();

require('co-mocha');

var wrongInfoOptions = {
  app_key: 'solee#gugu',
  client_id: 'guess',
  client_secret: 'secret',
  org_name: 'solee',
  app_name: 'gugug',
  redis: {
    host: '127.0.0.1',
    port: 6379,
    auth: 'haha1'
  }
};
var wrongParamsOptions = {
  org_name: 'solee',
  app_name: 'gugu',
  redis: {
    host: '127.0.0.1',
    port: 6379,
    auth: 'haha2'
  }
};

describe("Check input options with get access token", function () {
  it ("should return fail message with wrong params number options", function () {
    var em = easemob(wrongParamsOptions);
    em.should.have.property('code').equal(1);
    em.should.have.property('message').have.string('Missing required property');
  });

  it ("should return fail message with wrong info options", function * () {
    var em = easemob(wrongInfoOptions);
    var resp = yield em.getToken();
    // console.log(resp);
    // resp.should.have.property('code').equal(1);
    // resp.should.have.property('data').have.property('error').equal('organization_application_not_found');
  });
});
