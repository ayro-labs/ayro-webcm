const properties = require('./properties');
const logger = require('../utils/logger');

exports.env = properties.getValue('app.env', 'development');
exports.port = properties.getValue('app.port', 3100);
exports.wsPort = properties.getValue('app.wsPort', 3102);
exports.debug = properties.getValue('app.debug', false);

exports.session = {
  secret: 'ayro.io',
  prefix: 'session:',
  requestHeader: 'token',
  maxAge: Number.MAX_SAFE_INTEGER,
};

exports.redis = {
  host: properties.getValue('redis.host', 'localhost'),
  port: properties.getValue('redis.port', 6379),
  password: properties.getValue('redis.password'),
};

if (properties.getValue('https')) {
  exports.https = {
    key: properties.getValue('https.key'),
    cert: properties.getValue('https.cert'),
  };
}

if (this.env === 'production' && !this.https) {
  throw new Error('Https is required when running in production environment');
}

logger.info('Using %s environment settings', this.env);
logger.info('Debug mode is %s', this.debug ? 'ON' : 'OFF');
