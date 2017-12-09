const {properties, logger} = require('@ayro/commons');

exports.env = properties.get('app.env', 'development');
exports.port = properties.get('app.port', 3100);
exports.wsPort = properties.get('app.wsPort', 3102);
exports.debug = properties.get('app.debug', false);

exports.session = {
  secret: 'ayro.io',
  prefix: 'session:',
  requestHeader: 'token',
  maxAge: Number.MAX_SAFE_INTEGER,
};

exports.redis = {
  host: properties.get('redis.host', 'localhost'),
  port: properties.get('redis.port', 6379),
  password: properties.get('redis.password'),
};

logger.info('Using %s environment settings', this.env);
logger.info('Debug mode is %s', this.debug ? 'ON' : 'OFF');
