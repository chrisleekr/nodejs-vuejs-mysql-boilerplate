/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
const { getPool } = require('./app/helpers/database');

// Override port for supertest
process.env.PORT = 3001;

// eslint-disable-next-line no-promise-executor-return
const timeout = () => new Promise(resolve => setTimeout(resolve, 3000));

const isDatabaseReady = async () => {
  console.log('Checking database is ready or not before running test...');
  const limit = 20;

  for (let count = 1; count < limit; count += 1) {
    console.log(`Checking ${count} time${count >= 1 ? 's' : ''}`);
    try {
      const user = await (
        await getPool()
      ).query(
        `
          SELECT
            *
          FROM user
          LIMIT 1
        `
      );

      if (user[0]) {
        console.log(`Database is connected, start testing...`);

        (await getPool()).end();
        break;
      } else {
        console.log(`Database is not yet connected, wait for a second and check again...`);
        await timeout();
      }
    } catch (e) {
      console.log(`Error occurred. Database is not yet connected, wait for a second and check again...`);
      await timeout();
    }
  }
};

module.exports = async () => {
  await isDatabaseReady();
};
