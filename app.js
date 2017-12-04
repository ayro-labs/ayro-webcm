const settings = require('./configs/settings');
const routes = require('./configs/routes');
const ws = require('./configs/ws');
const logger = require('./utils/logger');
const loggerServer = require('./utils/logger-server');
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
app.use(morgan('tiny', {stream: loggerServer.stream}));
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
