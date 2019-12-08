/* eslint-disable no-await-in-loop */
const { getPool } = require('./app/helpers/database');
const { logger } = require('./app/helpers/logger');

const timeout = () => new Promise(resolve => setTimeout(resolve, 3000));

const isDatabaseReady = async () => {
  logger.info('Checking database is ready or not before running test...');
  const limit = 10;

  for (let count = 1; count < limit; count += 1) {
    logger.info(`Checking ${count} time${count >= 1 ? 's' : ''}`);
    try {
      const user = await (await getPool()).query(
        `
          SELECT
            *
          FROM user
          LIMIT 1
        `
      );

      if (user[0]) {
        logger.info(`Database is connected, start testing...`);

        (await getPool()).end();
        break;
      } else {
        logger.info(`Database is not yet connected, wait for a second and check again...`);
        await timeout();
      }
    } catch (e) {
      logger.info(`Error occurred. Database is not yet connected, wait for a second and check again...`);
      await timeout();
    }
  }
};

const jestSetup = async () => {
  await isDatabaseReady();
};

module.exports = jestSetup;
