const sessions = require('../utils/sessions');
const logger = require('../utils/logger');
const faye = require('faye');
const util = require('util');

const SUBSCRIPTION_PATTERN = '/users/%s';
const SUBSCRIBE_CHANNEL = '/meta/subscribe';
const AUTH_ERROR = 'api.token.invalid';

exports.configure = (wsServer) => {

  function emitAuthError(message, callback) {
    message.error = AUTH_ERROR;
    callback(message);
  }

  const bayeux = new faye.NodeAdapter({mount: '/'});
  bayeux.addExtension({
    incoming: (message, request, callback) => {
      if (message.channel !== SUBSCRIBE_CHANNEL) {
        callback(message);
        return;
      }
      if (!message.ext || !message.ext.api_token) {
        emitAuthError(message, callback);
        return;
      }
      sessions.getUser(message.ext.api_token).then((user) => {
        if (util.format(SUBSCRIPTION_PATTERN, user.id) === message.subscription) {
          logger.info('Subscribing user %s', user.id);
          callback(message);
        } else {
          emitAuthError(message, callback);
        }
      }).catch((err) => {
        logger.error('Could not get user from session', err);
        emitAuthError(message, callback);
      });
    },
  });
  bayeux.attach(wsServer);
  return bayeux;

};
