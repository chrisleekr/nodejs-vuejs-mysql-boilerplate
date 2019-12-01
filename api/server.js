require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const audit = require('express-requests-logger');
const { logger } = require('./app/helpers/logger');

const app = express();

const port = process.env.PORT || 3000;

app.set('trust proxy', true);
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(
  audit({
    logger,
    excludeURLs: [],
    request: {
      maskBody: ['password'],
      excludeHeaders: [],
      excludeBody: [],
      maskHeaders: ['authorization'],
      maxBodyLength: 0
    },
    response: {
      maskBody: ['authKey'],
      excludeHeaders: [],
      excludeBody: [],
      maskHeaders: [],
      maxBodyLength: 0
    }
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./app/routes/index')(app);

// catch 404 and forward to error handler
app.get('*', (_req, res) => {
  res.send({ success: false, status: 404, message: 'Page not found.', data: {} }, 404);
});

app.listen(port);

logger.info(`API server started on: ${port}`);
