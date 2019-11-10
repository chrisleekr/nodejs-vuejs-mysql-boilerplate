const _ = require('lodash');
const bcrypt = require('bcryptjs');
const { getPool, fetchWithPagination } = require('../helpers/database');
const { logger } = require('../helpers/logger');

const moduleLogger = logger.child({ module: 'userModel' });

const userStatus = {
  active: 10,
  deleted: 0,
  pending: -1
};

const userRole = {
  administrator: 99,
  staff: 50,
  user: 1
};

const findAll = async ({
  searchOptions = {},
  orderBy = 'id ASC',
  includePasswordHash = false,
  page = 1,
  pageSize = 10
} = {}) => {
  moduleLogger.debug({ searchOptions, orderBy, includePasswordHash, page, pageSize }, 'findAll called');

  let result = { rows: [], pagination: {} };
  const where = [];
  const values = [];

  where.push('status = ?');
  values.push(userStatus.active);

  _.forIn(searchOptions, (value, key) => {
    if (key === 'q') {
      if (value) {
        where.push(`(username LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)`);
        _.times(4, () => {
          values.push(`%${value}%`);
        });
      }
    } else {
      where.push(`${key} = ?`);
      values.push(value);
    }
  });

  const passwordHash = includePasswordHash ? 'password_hash, password_reset_token' : '';

  const query = `
    SELECT
      id,
      username,
      first_name,
      last_name,
      ${passwordHash}
      email,
      confirmed_at,
      registration_ip,
      last_login_at,
      last_login_ip,
      blocked_at,
      role,
      status,
      created_at,
      updated_at
    FROM user
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
  let passwordHash = null;
  if (row.password) {
    passwordHash = bcrypt.hashSync(row.password, bcrypt.genSaltSync(+process.env.BCRYPT_SALTING_ROUND));
  }

  try {
    result = await (await getPool()).query(
      `
        INSERT INTO user (
          username,
          first_name,
          last_name,
          auth_key,
          auth_key_expired_at,
          password_hash,
          password_reset_token,
          email,
          registration_ip,
          last_login_at,
          last_login_ip,
          blocked_at,
          status
        ) VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
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
        row.username,
        row.first_name,
        row.last_name,
        row.auth_key,
        row.auth_key_expired_at,
        passwordHash,
        row.password_reset_token,
        row.email,
        row.registration_ip,
        row.last_login_at,
        row.last_login_ip,
        row.blocked_at,
        row.status
      ]
    );
  } catch (e) {
    moduleLogger.error(e);
    throw e;
  }

  moduleLogger.debug({ result }, 'Inserted user result');

  return {
    result: true,
    id: result.insertId
  };
};

const getOne = async ({ searchOptions = {}, includePasswordHash = false, includeDeletedUser = false } = {}) => {
  let row = {};
  const where = [];
  const values = [];

  if (!searchOptions.status && includeDeletedUser === false) {
    where.push('status != ?');
    values.push(userStatus.deleted);
  }

  _.forIn(searchOptions, (value, key) => {
    if (key === 'usernameOrEmail') {
      where.push(`(username = ? OR email = ?)`);
      values.push(value);
      values.push(value);
    } else if (key === 'excludeId') {
      where.push(`(id != ?)`);
      values.push(value);
    } else {
      where.push(`${key} = ?`);
      values.push(value);
    }
  });

  const passwordHash = includePasswordHash ? 'password_hash, password_reset_token' : '';

  try {
    row = await (await getPool()).query(
      `
        SELECT
          id,
          username,
          first_name,
          last_name,
          ${passwordHash}
          email,
          confirmed_at,
          registration_ip,
          last_login_at,
          last_login_ip,
          blocked_at,
          role,
          status,
          created_at,
          updated_at
        FROM
          user
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

  moduleLogger.debug({ row }, 'User row result');

  return row[0] || [];
};

const updateOne = async (id, row) => {
  let result = false;

  const fields = [];
  const values = [];

  _.forIn(row, (value, key) => {
    if (key === 'password') {
      fields.push('password_hash = ?');
      values.push(bcrypt.hashSync(row.password, bcrypt.genSaltSync(+process.env.BCRYPT_SALTING_ROUND)));
    } else if (key !== 'id') {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });

  values.push(id);

  try {
    result = await (await getPool()).query(
      `
        UPDATE
          user
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

  moduleLogger.debug({ result }, 'Update user result');

  return {
    result: true
  };
};

const deleteOne = async id => {
  let result = false;

  try {
    result = await (await getPool()).query(
      `
        UPDATE user
        SET status = ?
        WHERE id = ?
      `,
      [userStatus.inactive, id]
    );
  } catch (e) {
    moduleLogger.error(e);
    throw e;
  }

  moduleLogger.debug({ result }, 'Delete user result');

  return {
    result: true
  };
};

module.exports = { findAll, insertOne, getOne, updateOne, deleteOne, userRole, userStatus };
