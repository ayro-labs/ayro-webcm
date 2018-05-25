'use strict';

const {configs, paths} = require('@ayro/commons');

const config = configs.load(paths.root('config.yml'));

exports.env = config.get('app.env', 'development');
exports.port = config.get('app.port', 3100);
exports.wsPort = config.get('app.wsPort', 3102);
exports.debug = config.get('app.debug', false);

exports.session = {
  prefix: 'session:',
  keyId: config.get('session.keyId'),
  secret: config.get('session.secret'),
};

exports.redis = {
  host: config.get('redis.host', 'localhost'),
  port: config.get('redis.port', 6379),
  password: config.get('redis.password'),
};

if (!this.session.keyId) {
  throw new Error('Property session.keyId is required');
}
if (!this.session.secret) {
  throw new Error('Property session.secret is required');
}
