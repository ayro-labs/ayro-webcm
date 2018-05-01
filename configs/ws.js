'use strict';

const session = require('../utils/session');
const {logger} = require('@ayro/commons');
const faye = require('faye');
const util = require('util');

const SUBSCRIPTION_PATTERN = '/users/%s';
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
          const user = await session.getUser(message.ext.api_token);
          if (user && util.format(SUBSCRIPTION_PATTERN, user.id) === message.subscription) {
            logger.info('Subscribing user %s', user.id);
            callback(message);
          } else {
            emitAuthError(message, callback);
          }
        } catch (err) {
          logger.error('Could not get user from session', err);
          emitAuthError(message, callback);
        }
      })();
    },
  });
  bayeux.attach(wsServer);
  return bayeux;
};
