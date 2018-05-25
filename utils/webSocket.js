'use strict';

const session = require('./session');
const {logger} = require('@ayro/commons');
const faye = require('faye');
const util = require('util');

const SUBSCRIPTION_PATTERN = '/devices/%s';
const SUBSCRIBE_CHANNEL = '/meta/subscribe';
const AUTH_ERROR = 'invalid_token';

const bayeux = new faye.NodeAdapter({mount: '/'});
bayeux.addExtension({
  incoming: (message, request, callback) => {
    (async () => {
      if (message.channel !== SUBSCRIBE_CHANNEL) {
        callback(message);
        return;
      }
      if (!message.ext || !message.ext.api_token) {
        message.error = AUTH_ERROR;
        callback(message);
        return;
      }
      try {
        const device = await session.getDevice(message.ext.api_token);
        if (device && util.format(SUBSCRIPTION_PATTERN, device.id) === message.subscription) {
          logger.info('Subscribing device %s', device.id);
        } else {
          message.error = AUTH_ERROR;
        }
      } catch (err) {
        logger.error('Could not get device from session', err);
        message.error = AUTH_ERROR;
      }
      callback(message);
    })();
  },
});

exports.attach = (server) => {
  bayeux.attach(server);
};

exports.publish = (topic, message) => {
  bayeux.getClient().publish(topic, message);
};
