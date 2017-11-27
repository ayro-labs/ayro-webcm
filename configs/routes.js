const logger = require('../utils/logger');
const indexRoutes = require('../routes');

exports.configure = (express, app, webSocket) => {

  logger.info('Configuring routes');

  indexRoutes(express.Router(), app, webSocket);

};
