'use strict';

require('newrelic');

const {properties, logger, loggerServer} = require('@ayro/commons');
const path = require('path');

properties.setup(path.join(__dirname, 'config.properties'));
logger.setup(path.join(__dirname, 'ayro-webcm.log'));
loggerServer.setup();

const settings = require('./configs/settings');
const routes = require('./configs/routes');
const ws = require('./configs/ws');
const http = require('http');
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');

require('json.date-extensions');

// Parse string to date when call JSON.parse
JSON.useDateParser();

const app = express();

app.set('env', settings.env);
app.set('port', settings.port);

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan('tiny', {stream: {write: message => loggerServer.debug(message)}}));
app.use(cors());

const wsServer = http.createServer();
const webSocket = ws.configure(wsServer);
wsServer.listen(settings.wsPort, () => {
  logger.info('Ayro Webcm websocket is listening on port %s', settings.wsPort);
});

routes.configure(express, app, webSocket);

app.listen(app.get('port'), () => {
  logger.info('Ayro Webcm server is listening on port %s', app.get('port'));
});
