const settings = require('../configs/settings');
const errors = require('../utils/errors');
const redis = require('redis');
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const redisClient = redis.createClient({
  host: settings.redis.host,
  port: settings.redis.port,
  password: settings.redis.password,
});

const verifyAsync = Promise.promisify(jwt.verify);

exports.getUser = async (token) => {
  const decoded = await verifyAsync(token, settings.session.secret);
  if (!decoded.jti) {
    throw errors.ayroError('session.user.invalid', 'Invalid session');
  }
  const session = await redisClient.getAsync(settings.session.prefix + decoded.jti);
  if (!session) {
    throw errors.ayroError('session.user.notFound', 'Session user not found');
  }
  try {
    const sessionData = JSON.parse(session);
    return sessionData.user;
  } catch (err) {
    throw errors.ayroError('session.user.parseError', 'Could not parse user data', err);
  }
};
