/**
 * Created by solee on 7/15/16.
 */
'use strict';

var assert = require('assert');
var util = require('util');
var redis = require('redis');
var wrapper = require('co-redis');
var cacher = null;
var schema = require('./schema');
var tv4 = require('tv4');
var request = require('koa-request');
var _ = require('lodash');

var EMBASEURL = 'https://a1.easemob.com/%s/%s';
var KEY = 'easemob:token';
var SUCCESS = {code: 0, message: 'success'};
var FAIL = {code: 1, message: 'fail'};

module.exports = init;

function init(opt) {
  return Easemob(opt);
}

function Easemob(opt) {
  if (!(this instanceof Easemob)) {
    return new Easemob(opt);
  }

  var validInfo = tv4.validateResult(opt, schema.initOptionsSchema());
  // assert(validInfo.valid, validInfo.error);
  if(!validInfo.valid) {
    let fail = _.clone(FAIL);
    fail.message = validInfo.error.message + validInfo.error.dataPath;
    return fail;
  }


  var client = redis.createClient(opt.redis.port, opt.redis.host, {no_ready_check: false});
  if (!!opt.redis.auth) {
    client.auth(opt.redis.auth);
  }
  cacher = wrapper(client);
  
  this.url = util.format(EMBASEURL, opt.org_name, opt.app_name);
  this.opt = opt;
  this.appKey = opt.app_key;
  this.clientId = opt.client_id;
  this.clientSecret = opt.client_secret;
  this.orgName = opt.org_name;
  this.appName = opt.app_name;
}

// Get Easemob Access Token
Easemob.prototype.getToken = function *() {
  try {
    var self = this;

    // Check whether token already existed in redis
    var token = yield cacher.get(KEY);

    if(!!token) {
      let success = _.clone(SUCCESS);
      success.data = {};
      success.data.token = token;
      return success;
    }

    // Not in redis, get token from easemob api and put it in redis
    var bodyData = {
      grant_type: 'client_credentials',
      client_id: self.clientId,
      client_secret: self.clientSecret
    };

    var options = {
      method: 'POST',
      url: self.url + '/token',
      json: true,
      timeout: 10000,
      body: bodyData
    };

    var resp = yield request(options);
    if (resp.statusCode !== 200) {
      let fail = _.clone(FAIL);
      fail.data = resp.body;
      return fail;
    }

    var body = resp.body;
    yield cacher.setex(KEY, body.expires_in, body.access_token);

    let success = _.clone(SUCCESS);
    success.data = {};
    success.data.token = body.access_token;
    return success;
  } catch (e) {
    console.log(e);
    return FAIL;
  }
};

// Register User on Easemob
Easemob.prototype.registerUser = function * (username, password) {
  try {
    var self = this;

    if (!username || !password) {
      let fail = _.clone(FAIL);
      fail.message = 'input params error';
      return fail;
    }

    var token = yield self.getToken();
    if (token.code !== 0){
      return FAIL;
    }
    token = token.data.token;

    var bodyData = {
      username: username,
      password: password
    };

    var options = {
      method: 'POST',
      url: self.url + '/users',
      json: true,
      timeout: 10000,
      body: bodyData,
      headers: {
        Authorization: 'Bearer ' + token
      }
    };

    var resp = yield request(options);
    if (resp.statusCode !== 200) {
      let fail = _.clone(FAIL);
      fail.message = resp.body.error;
      return fail;
    }

    let success = _.clone(SUCCESS);
    success.data = resp.body.entities[0];
    return success;
  } catch (e) {
    console.log(e);
    return FAIL;
  }
};



// Get User Info from Easemob
Easemob.prototype.getUser = function * (username) {
  try {
    var self = this;

    if (!username) {
      let fail = _.clone(FAIL);
      fail.message = 'input params error';
      return fail;
    }

    var token = yield self.getToken();
    if (token.code !== 0){
      return FAIL;
    }
    token = token.data.token;

    var options = {
      method: 'GET',
      url: self.url + '/users/' + username,
      json: true,
      timeout: 10000,
      headers: {
        Authorization: 'Bearer ' + token
      }
    };

    var resp = yield request(options);
    if (resp.statusCode !== 200) {
      let fail = _.clone(FAIL);
      fail.message = resp.body.error;
      return fail;
    }

    let success = _.clone(SUCCESS);
    success.data = resp.body.entities[0];
    return success;
  } catch (e) {
    console.log(e);
    return FAIL;
  }
};

Easemob.prototype.deleteUser = function * (username) {
  try {
    var self = this;

    if (!username) {
      let fail = _.clone(FAIL);
      fail.message = 'input params error';
      return fail;
    }

    var token = yield self.getToken();
    if (token.code !== 0){
      return FAIL;
    }
    token = token.data.token;

    var options = {
      method: 'DELETE',
      url: self.url + '/users/' + username,
      json: true,
      timeout: 10000,
      headers: {
        Authorization: 'Bearer ' + token
      }
    };

    var resp = yield request(options);
    if (resp.statusCode !== 200) {
      let fail = _.clone(FAIL);
      fail.message = resp.body.error;
      return fail;
    }

    let success = _.clone(SUCCESS);
    success.data = resp.body.entities[0];
    return success;
  } catch (e) {
    console.log(e);
    return FAIL;
  }
};

// Reset User Password
Easemob.prototype.resetPassword = function * (username, newpassword) {
  try {
    var self = this;

    if (!username || !newpassword) {
      let fail = _.clone(FAIL);
      fail.message = 'input params error';
      return fail;
    }

    var token = yield self.getToken();
    if (token.code !== 0){
      return FAIL;
    }
    token = token.data.token;

    var options = {
      method: 'PUT',
      url: self.url + '/users/' + username + '/password',
      json: true,
      timeout: 10000,
      body: {
        newpassword: newpassword
      },
      headers: {
        Authorization: 'Bearer ' + token
      }
    };

    var resp = yield request(options);
    if (resp.statusCode !== 200) {
      let fail = _.clone(FAIL);
      fail.message = resp.body.error;
      return fail;
    }

    let success = _.clone(SUCCESS);
    success.data = resp.body;
    return success;
  } catch (e) {
    console.log(e);
    return FAIL;
  }
};

// Modify Nickname of User
Easemob.prototype.modifyNickname = function * (username, nickname) {
  try {
    var self = this;

    if (!username || !nickname) {
      let fail = _.clone(FAIL);
      fail.message = 'input params error';
      return fail;
    }

    var token = yield self.getToken();
    if (token.code !== 0){
      return FAIL;
    }
    token = token.data.token;

    var options = {
      method: 'PUT',
      url: self.url + '/users/' + username,
      json: true,
      timeout: 10000,
      body: {
        nickname: nickname
      },
      headers: {
        Authorization: 'Bearer ' + token
      }
    };

    var resp = yield request(options);
    if (resp.statusCode !== 200) {
      let fail = _.clone(FAIL);
      fail.message = resp.body.error;
      return fail;
    }

    let success = _.clone(SUCCESS);
    success.data = resp.body.entities[0];
    return success;
  } catch (e) {
    console.log(e);
    return FAIL;
  }
};