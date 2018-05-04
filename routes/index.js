'use strict';

const {logger} = require('@ayro/commons');

module.exports = (router, app, ws) => {
  app.post('/push/:device', (req, res) => {
    logger.debug('Publishing message of event %s to device %s', req.body.event, req.params.device);
    const {message} = req.body;
    message.date = message.date.toJSON();
    ws.getClient().publish(`/devices/${req.params.device}`, req.body);
    res.sendStatus(200);
  });
};
