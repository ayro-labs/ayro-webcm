'use strict';

const settings = require('../configs/settings');
const redis = require('redis');
const JwtRedis = require('jsonwebtoken-redis');
const Promise = require('bluebird');

const SCOPE_USER = 'user';

const redisClient = redis.createClient({
  host: settings.redis.host,
  port: settings.redis.port,
  password: settings.redis.password,
});

const jwtRedis = new JwtRedis(redisClient, {
  prefix: settings.session.prefix,
  promiseImpl: Promise,
});

exports.getUser = async (token) => {
  try {
    const decoded = await jwtRedis.decode(token, {complete: true});
    if (decoded.header.kid === settings.session.keyId) {
      const payload = await jwtRedis.verify(token, settings.session.secret);
      if (payload.scope === SCOPE_USER) {
        return {id: payload.user};
      }
    }
  } catch (err) {
    if (!(err instanceof JwtRedis.TokenExpiredError)) {
      throw err;
    }
  }
  return null;
};
