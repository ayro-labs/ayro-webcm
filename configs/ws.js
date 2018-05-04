'use strict';

const session = require('../utils/session');
const {logger} = require('@ayro/commons');
const faye = require('faye');
const util = require('util');

const SUBSCRIPTION_PATTERN = '/devices/%s';
const SUBSCRIBE_CHANNEL = '/meta/subscribe';
const AUTH_ERROR = 'invalid_token';

function emitAuthError(message, callback) {
  message.error = AUTH_ERROR;
  callback(message);
}

exports.configure = (wsServer) => {
  const bayeux = new faye.NodeAdapter({mount: '/'});
  bayeux.addExtension({
    incoming: (message, request, callback) => {
      (async () => {
        if (message.channel !== SUBSCRIBE_CHANNEL) {
          callback(message);
          return;
        }
        if (!message.ext || !message.ext.api_token) {
          emitAuthError(message, callback);
          return;
        }
        try {
          const device = await session.getDevice(message.ext.api_token);
          if (device && util.format(SUBSCRIPTION_PATTERN, device.id) === message.subscription) {
            logger.info('Subscribing device %s', device.id);
            callback(message);
          } else {
            emitAuthError(message, callback);
          }
        } catch (err) {
          logger.error('Could not get device from session', err);
          emitAuthError(message, callback);
        }
      })();
    },
  });
  bayeux.attach(wsServer);
  return bayeux;
};
