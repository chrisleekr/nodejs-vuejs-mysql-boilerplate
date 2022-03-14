const _ = require('lodash');
const moment = require('moment');
const { getPool } = require('../helpers/database');
const { logger } = require('../helpers/logger');

const moduleLogger = logger.child({ module: 'userAuthModel' });

// List of status
const userAuthStatus = {
  active: 1,
  deleted: 0
};

/**
 * Find all user auths that matches search options
 */
const findAllWithoutPagination = async ({
  searchOptions = {},
  orderBy = 'id DESC',
  includeActiveRefreshAuthKeyOnly = true
} = {}) => {
  let rows = {};
  moduleLogger.debug({ searchOptions, orderBy, includeActiveRefreshAuthKeyOnly }, 'findAllWithoutPagination called');

  const where = [];
  const values = [];

  _.forIn(searchOptions, (value, key) => {
    where.push(`${key} = ?`);
    values.push(value);
  });

  if (includeActiveRefreshAuthKeyOnly === true) {
    where.push(`refresh_auth_key_expired_at >= ?`);
    values.push(moment().format('YYYY-MM-DD HH:mm:ss'));
  }

  const query = `
    SELECT
      id,
      user_id,
      auth_key,
      auth_key_expired_at,
      refresh_auth_key,
      refresh_auth_key_expired_at,
      status,
      CASE
        WHEN status = ${userAuthStatus.active} THEN "Active"
        WHEN status = ${userAuthStatus.deleted} THEN "Deleted"
        ELSE "Unknown status"
      END AS status_name,
      created_at,
      updated_at
    FROM user_auth
    WHERE
      ${_.join(where, ' AND ')}
    ORDER BY
      ${orderBy}
  `;

  try {
    // Get rows/pagination
    rows = await (await getPool()).query(query, values);
  } catch (e) {
    moduleLogger.error(e);
    throw e;
  }

  moduleLogger.debug({ rows });

  return rows;
};

/**
 * Insert new user
 */
const insertOne = async row => {
  let result = false;

  try {
    result = await (
      await getPool()
    ).query(
      `
        INSERT INTO user_auth (
          user_id,
          auth_key,
          auth_key_expired_at,
          refresh_auth_key,
          refresh_auth_key_expired_at,
          status
        ) VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
        );
      `,
      [
        row.user_id,
        row.auth_key,
        row.auth_key_expired_at,
        row.refresh_auth_key,
        row.refresh_auth_key_expired_at,
        row.status
      ]
    );
  } catch (e) {
    moduleLogger.error(e);
    throw e;
  }

  moduleLogger.debug({ result }, 'Inserted user auth result');

  return {
    result: true,
    id: result.insertId
  };
};

/**
 * Get single user
 */
const getOne = async ({ searchOptions = {} }) => {
  let row = {};
  const where = [];
  const values = [];

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
          user_id,
          auth_key,
          auth_key_expired_at,
          refresh_auth_key,
          refresh_auth_key_expired_at,
          status,
          CASE
            WHEN status = ${userAuthStatus.active} THEN "Active"
            WHEN status = ${userAuthStatus.deleted} THEN "Deleted"
            ELSE "Unknown status"
          END AS status_name,
          created_at,
          updated_at
        FROM
          user_auth
        WHERE
          ${_.join(where, ' AND ')}
        LIMIT 1
      `,
      values
    );

    row = row[0] || [];
  } catch (e) {
    moduleLogger.error(e);
    throw e;
  }

  moduleLogger.debug({ row }, 'User auth row result');

  return row;
};

/**
 * Update existing user auth
 */
const updateOne = async (id, row) => {
  let result = false;

  const fields = [];
  const values = [];
  _.forIn(row, (value, key) => {
    if (key !== 'id') {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });

  values.push(id);

  try {
    result = await (
      await getPool()
    ).query(
      `
        UPDATE
          user_auth
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

  moduleLogger.debug({ result }, 'Update user auth result');

  return {
    result: true,
    id
  };
};

/**
 * Delete existing user auth
 */
const deleteOne = async id => {
  let result = false;

  try {
    result = await (
      await getPool()
    ).query(
      `
        UPDATE user_auth
        SET status = ?
        WHERE id = ?
      `,
      [userAuthStatus.deleted, id]
    );
  } catch (e) {
    moduleLogger.error(e);
    throw e;
  }

  moduleLogger.debug({ result }, 'Delete user auth result');

  return {
    result: true
  };
};

module.exports = { userAuthStatus, findAllWithoutPagination, insertOne, getOne, updateOne, deleteOne };
