const bunyan = require('bunyan');
const packageJson = require('../../package.json');

const logger = bunyan.createLogger({
  name: 'api',
  version: packageJson.version,
  streams: [{ stream: process.stdout, level: 'trace' }]
});
logger.info('API logger loaded');

module.exports = { logger };
