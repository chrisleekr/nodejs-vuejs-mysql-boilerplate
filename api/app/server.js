const config = require('config');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const bunyanMiddleware = require('bunyan-middleware');
const { logger } = require('./helpers/logger');

const app = express();

const port = config.get('port') || 3000;

app.set('trust proxy', true);
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(
  bunyanMiddleware({
    headerName: 'X-Request-Id',
    propertyName: 'reqId',
    logName: 'reqId',
    obscureHeaders: ['authorization'],
    logger,
    additionalRequestFinishData: (_req, _res) => ({})
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./routes/index')(app);

// catch 404 and forward to error handler
app.get('*', (_req, res) => {
  res.send({ success: false, status: 404, message: 'Page not found.', data: {} }, 404);
});

const server = app.listen(port);

logger.info(`API server started on: ${port}`);

module.exports = { app, server };
