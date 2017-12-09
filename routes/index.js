const {logger} = require('@ayro/commons');

module.exports = (router, app, webSocket) => {

  app.post('/push/:user', (req, res) => {
    logger.debug('Publishing message of event %s to user %s', req.body.event, req.params.user);
    webSocket.getClient().publish(`/users/${req.params.user}`, req.body);
    res.sendStatus(200);
  });

};
