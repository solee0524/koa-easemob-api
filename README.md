# koa-easemob-api
Visit easemob api with koa generator function.

使用generator方式访问环信API

<p align="left">
  <a href="https://npmjs.org/package/koa-easemob-api">
    <img src="https://img.shields.io/npm/v/koa-easemob-api.svg?style=flat-square"
         alt="NPM Version">
  </a>

  <a href="https://coveralls.io/r/solee0524/koa-easemob-api">
    <img src="https://img.shields.io/coveralls/solee0524/koa-easemob-api.svg?style=flat-square"
         alt="Coverage Status">
  </a>

  <a href="https://travis-ci.org/solee0524/koa-easemob-api">
    <img src="https://img.shields.io/travis/solee0524/koa-easemob-api.svg?style=flat-square"
         alt="Build Status">
  </a>

  <a href="https://npmjs.org/package/koa-easemob-api">
    <img src="http://img.shields.io/npm/dm/koa-easemob-api.svg?style=flat-square"
         alt="Downloads">
  </a>

  <a href="https://david-dm.org/solee0524/koa-easemob-api.svg">
    <img src="https://david-dm.org/solee0524/koa-easemob-api.svg?style=flat-square"
         alt="Dependency Status">
  </a>

  <a href="https://github.com/solee0524/koa-easemob-api/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/koa-easemob-api.svg?style=flat-square"
         alt="License">
  </a>
</p>

## Install

```
npm install koa-easemob-api --save
```

## Usage

```
var easemob = require('koa-easemob-api');

var em = easemob({
  app_key: 'solee#gugu',
  client_id: 'guess',
  client_secret: 'secret',
  org_name: 'solee',
  app_name: 'gugu',
  redis: {
    host: '127.0.0.1',
    port: 6379,
    auth: 'haha1'
  }
});

var resp = yield em.registerUser('username', 'password');
resp = yield em.getUser('username');
resp = yield em.deleteUser('username');
resp = yield em.resetPassword('username', 'newpassword');
resp = yield em.modifyNickname('username', 'nickname');

```

`**auth**`为可选输入参数, 根据您的redis-server是否设置密码再填写.

代码会在调用以上方法的时候,使用`em.getToken()`方法获取环信的token.

在redis中查看是否已有环信token, 若有则使用该token进行后续服务验证; 若没有则利用输入信息访问环信API获取token并放在redis中.

**redis key**: easemob:token

**ttl**: 根据环信返回的过期时间设定


## Supported Api

#### users

 * **registerUser**     注册环信用户
 * **getUser**          获取环信用户信息
 * **deleteUser**       删除环信用户
 * **resetPassword**    重设环信用户密码
 * **modifyNickname**   修改环信用户昵称

## License
MIT © Bo Li ([solee.me](http://solee.me))