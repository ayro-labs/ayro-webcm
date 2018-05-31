'use strict';

const {logger} = require('@ayro/commons');
const webSocket = require('utils/webSocket');

module.exports = (router, app) => {
  app.post('/push/:device', (req, res) => {
    logger.debug('Publishing message of event %s to device %s', req.body.event, req.params.device);
    const {message} = req.body;
    message.date = message.date.toJSON();
    webSocket.publish(`/devices/${req.params.device}`, req.body);
    res.sendStatus(200);
  });
};
