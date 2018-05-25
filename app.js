'use strict';

require('newrelic');

const {logger} = require('@ayro/commons');

const settings = require('./configs/settings');
const routes = require('./configs/routes');
const webSocket = require('./utils/webSocket');
const path = require('path');
const http = require('http');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
require('json.date-extensions');

logger.setup({
  file: path.resolve('ayro-webcm.log'),
  level: settings.debug ? 'debug' : 'info',
});

// Parse string to date when call JSON.parse
JSON.useDateParser();

const app = express();

app.set('env', settings.env);
app.set('port', settings.port);

app.use(morgan('tiny', {stream: {write: message => logger.console.debug(message)}}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(compression());
app.use(cors());

logger.info('Using %s environment settings', settings.env);
logger.info('Debug mode is %s', settings.debug ? 'ON' : 'OFF');

routes.configure(express, app);

const wsServer = http.createServer();
wsServer.listen(settings.wsPort, () => {
  logger.info('Ayro Webcm web socket is listening on port %s', settings.wsPort);
});

webSocket.attach(wsServer);

app.listen(app.get('port'), () => {
  logger.info('Ayro Webcm server is listening on port %s', app.get('port'));
});
