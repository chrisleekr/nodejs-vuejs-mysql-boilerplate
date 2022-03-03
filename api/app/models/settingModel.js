const _ = require('lodash');
const { getPool, fetchWithPagination } = require('../helpers/database');
const { logger } = require('../helpers/logger');

const moduleLogger = logger.child({ module: 'settingModel' });

const settingMetaType = ['select', 'number', 'text'];

const settingStatus = {
  active: 1,
  deleted: 0
};

const findAll = async ({ searchOptions = {}, orderBy = 'meta_name ASC', page = 1, pageSize = 10 } = {}) => {
  moduleLogger.debug({ searchOptions, orderBy, page, pageSize }, 'findAll called');

  let result = { rows: [], pagination: {} };
  const where = [];
  const values = [];

  where.push('status = ?');
  values.push(settingStatus.active);

  _.forIn(searchOptions, (value, key) => {
    if (key === 'q') {
      if (value) {
        where.push(`(meta_key LIKE ? OR meta_name LIKE ?)`);
        _.times(2, () => {
          values.push(`%${value}%`);
        });
      }
    } else {
      where.push(`${key} = ?`);
      values.push(value);
    }
  });

  const query = `
    SELECT
      id,
      meta_key,
      meta_name,
      meta_type,
      meta_desc,
      meta_attribute,
      meta_value,
      is_public,
      status,
      created_at,
      updated_at
    FROM setting
    WHERE
      ${_.join(where, ' AND ')}
    ORDER BY
      ${orderBy}
  `;

  try {
    // Get rows/pagination
    result = await fetchWithPagination(query, values, { page, pageSize });
  } catch (e) {
    moduleLogger.error(e);
    throw e;
  }

  moduleLogger.debug({ result });

  return result;
};

const insertOne = async row => {
  let result = false;

  try {
    result = await (
      await getPool()
    ).query(
      `
        INSERT INTO setting (
          meta_key,
          meta_name,
          meta_type,
          meta_desc,
          meta_attribute,
          meta_value,
          is_public,
          status
        ) VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
        );
      `,
      [
        row.meta_key,
        row.meta_name,
        row.meta_type,
        row.meta_desc,
        row.meta_attribute,
        row.meta_value,
        row.is_public,
        row.status
      ]
    );
  } catch (e) {
    moduleLogger.error(e);
    throw e;
  }

  moduleLogger.debug({ result }, 'Inserted setting result');

  return {
    result: true,
    id: result.insertId
  };
};

const getOne = async ({ searchOptions = {}, includeDeletedSetting = false } = {}) => {
  let row = {};
  const where = [];
  const values = [];

  if (!searchOptions.status && includeDeletedSetting === false) {
    where.push('status != ?');
    values.push(settingStatus.deleted);
  }

  _.forIn(searchOptions, (value, key) => {
    where.push(`${key} = ?`);
    values.push(value);
  });

  try {
    row = await (
      await getPool()
    ).query(
      `
        SELECT
          id,
          meta_key,
          meta_name,
          meta_type,
          meta_desc,
          meta_attribute,
          meta_value,
          is_public,
          status,
          created_at,
          updated_at
        FROM
          setting
        WHERE
          ${_.join(where, ' AND ')}
        LIMIT 1
      `,
      values
    );
  } catch (e) {
    moduleLogger.error(e);
    throw e;
  }

  moduleLogger.debug({ row }, 'Setting row result');

  return row[0] || [];
};

const updateOne = async (id, row) => {
  let result = false;

  const fields = [];
  const values = [];

  _.forIn(row, (value, key) => {
    fields.push(`${key} = ?`);
    values.push(value);
  });

  values.push(id);

  try {
    result = await (
      await getPool()
    ).query(
      `
        UPDATE
          setting
        SET
          ${_.join(fields, ', ')}
        WHERE
          id = ?
      `,
      values
    );
  } catch (e) {
    moduleLogger.error(e);
    throw e;
  }

  moduleLogger.debug({ result }, 'Update setting result');

  return {
    result: true,
    id
  };
};

const deleteOne = async id => {
  let result = false;

  try {
    result = await (
      await getPool()
    ).query(
      `
        UPDATE setting
        SET status = ?
        WHERE id = ?
      `,
      [settingStatus.deleted, id]
    );
  } catch (e) {
    moduleLogger.error(e);
    throw e;
  }

  moduleLogger.debug({ result }, 'Delete setting result');

  return {
    result: true
  };
};

const deleteAll = async ({ searchOptions = {} }) => {
  let result = false;

  const where = [];
  const values = [];

  _.forIn(searchOptions, (value, key) => {
    if (key === 'excludeIds') {
      if (_.isEmpty(value) === false) {
        where.push(`id NOT IN (?)`);
        values.push(value);
      }
    } else {
      where.push(`${key} = ?`);
      values.push(value);
    }
  });

  if (_.isEmpty(where)) {
    return {
      result: false
    };
  }

  try {
    result = await (
      await getPool()
    ).query(
      `
        UPDATE setting
        SET status = ?
        WHERE
          ${_.join(where, ' AND ')}
      `,
      [settingStatus.deleted, ...values]
    );
  } catch (e) {
    moduleLogger.error(e);
    throw e;
  }

  moduleLogger.debug({ result }, 'Delete setting result');

  return {
    result: true
  };
};

module.exports = {
  findAll,
  insertOne,
  getOne,
  updateOne,
  deleteOne,
  deleteAll,
  settingStatus,
  settingMetaType
};
