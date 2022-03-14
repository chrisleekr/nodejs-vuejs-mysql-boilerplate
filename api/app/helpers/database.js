const config = require('config');
const mysql = require('promise-mysql');
const { logger } = require('./logger');

const moduleLogger = logger.child({ module: 'database' });

const dbConfig = {
  connectionLimit: config.get('db.connectionLimit'),
  host: config.get('db.host'),
  port: config.get('db.port'),
  user: config.get('db.user'),
  password: config.get('db.password'),
  database: config.get('db.name'),
  debug: config.get('db.debug') === 'true' ? ['ComQueryPacket', 'RowDataPacket'] : false,
  timezone: (new Date().getTimezoneOffset() / 60) * -1
};
moduleLogger.debug({ dbConfig });

let pool;

const getPool = async () => {
  if (pool) {
    moduleLogger.info('Return existing pool connection');
    return pool;
  }
  pool = await mysql.createPool(dbConfig);
  moduleLogger.info('Return new pool connection');
  return pool;
};

const currentTimestamp = {
  toSqlString: () => 'CURRENT_TIMESTAMP()'
};

const fetchWithPagination = async (query, values, { page = 1, pageSize = 10 } = {}) => {
  const regexStart = Date.now();

  const countQuery = query.replace(/(?<=SELECT)(\s.*?)+(?=FROM)/gim, ' COUNT(*) AS total ');
  const elapsedMs = Date.now() - regexStart;

  moduleLogger.debug({ countQuery, elapsedMs }, 'Replace query for counting with regex');

  // Get total first
  const totalResult = await (await getPool()).query(countQuery, values);

  const pageNo = page > 0 ? page - 1 : 0;
  const offset = pageNo * pageSize;
  const rowQuery = `${query} LIMIT ${offset}, ${pageSize}`;
  const rowResult = await (await getPool()).query(rowQuery, values);

  const totalRows = totalResult[0].total || 0;
  const firstRowNo = totalRows - offset;

  // Since this return value will be output, make underscore variable
  return {
    rows: rowResult,
    pagination: {
      page,
      page_size: pageSize,
      total_rows: totalRows,
      first_row_no: firstRowNo
    }
  };
};

module.exports = {
  getPool,
  currentTimestamp,
  fetchWithPagination
};
