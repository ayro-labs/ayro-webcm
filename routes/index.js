'use strict';

const {logger} = require('@ayro/commons');

module.exports = (router, app, ws) => {
  app.post('/push/:user', (req, res) => {
    logger.debug('Publishing message of event %s to user %s', req.body.event, req.params.user);
    const {message} = req.body;
    message.date = message.date.toJSON();
    ws.getClient().publish(`/users/${req.params.user}`, req.body);
    res.sendStatus(200);
  });
};
