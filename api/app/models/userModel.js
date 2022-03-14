const _ = require('lodash');
const config = require('config');
const bcrypt = require('bcryptjs');
const { getPool, fetchWithPagination } = require('../helpers/database');
const { logger } = require('../helpers/logger');
const { findPermissionUsers } = require('./permissionModel');

const moduleLogger = logger.child({ module: 'userModel' });

// List of enabled
const userEnabled = {
  active: 1,
  disabled: 0
};

// List of status
const userStatus = {
  active: 10,
  deleted: 0,
  pending: -1
};

// List of role
const userRole = {
  administrator: 99,
  staff: 50,
  user: 1
};

/**
 * Find all users that matches search options
 */
const findAll = async ({
  searchOptions = {},
  orderBy = 'id ASC',
  includePasswordHash = false,
  includePermissions = false,
  page = 1,
  pageSize = 10
} = {}) => {
  moduleLogger.debug({ searchOptions, orderBy, includePasswordHash, page, pageSize }, 'findAll called');

  let result = { rows: [], pagination: {} };
  const where = [];
  const values = [];

  // Force to get only active users
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
    } else if (key === 'roles') {
      where.push(`(role IN (?))`);
      values.push(value);
    } else {
      where.push(`${key} = ?`);
      values.push(value);
    }
  });

  // Return password related fields only if includePasswordHash is set as true
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
      CASE
        WHEN role = ${userRole.administrator} THEN "Administrator"
        WHEN role = ${userRole.staff} THEN "Staff"
        WHEN role = ${userRole.user} THEN "User"
        ELSE "Unknown role"
      END AS role_name,
      enabled,
      CASE
        WHEN enabled = ${userEnabled.active} THEN "Active"
        WHEN enabled = ${userEnabled.disabled} THEN "Disabled"
        ELSE "Unknown enabled"
      END AS enabled_name,
      status,
      CASE
        WHEN status = ${userStatus.active} THEN "Active"
        WHEN status = ${userStatus.deleted} THEN "Deleted"
        WHEN status = ${userStatus.pending} THEN "Pending"
        ELSE "Unknown status"
      END AS status_name,
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

    // If to include permissions
    if (includePermissions) {
      // Create promise array to get permissions and append permissions to the row
      const promises = result.rows.map(async row => {
        if (row.role === userRole.staff) {
          const newRow = row;
          newRow.permissions = await findPermissionUsers({
            searchOptions: {
              'permission_user.user_id': newRow.id
            }
          });
          return newRow;
        }
        return row;
      });

      await Promise.all(promises);
    }
  } catch (e) {
    moduleLogger.error(e);
    throw e;
  }

  moduleLogger.debug({ result });

  return result;
};

/**
 * Insert new user
 */
const insertOne = async row => {
  let result = false;
  let passwordHash = null;
  // If password is provided, then hash it
  if (row.password) {
    passwordHash = bcrypt.hashSync(row.password, bcrypt.genSaltSync(config.get('bcryptSaltingRound')));
  }

  try {
    result = await (
      await getPool()
    ).query(
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
          confirmed_at,
          registration_ip,
          last_login_at,
          last_login_ip,
          blocked_at,
          role,
          enabled,
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
        row.confirmed_at,
        row.registration_ip,
        row.last_login_at,
        row.last_login_ip,
        row.blocked_at,
        row.role,
        row.enabled,
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

/**
 * Get single user
 */
const getOne = async ({
  searchOptions = {},
  includePasswordHash = false,
  includeDeletedUser = false,
  includePermissions = false
} = {}) => {
  let row = {};
  const where = [];
  const values = [];

  // If status is not specified and includeDeleteUser is set as false
  if (!searchOptions.status && includeDeletedUser === false) {
    // Then retrieve the user who is not deleted
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
    } else if (key === 'roles') {
      where.push(`(role IN (?))`);
      values.push(value);
    } else {
      where.push(`${key} = ?`);
      values.push(value);
    }
  });

  // Return password related fields only if includePasswordHash is set as true
  const passwordHash = includePasswordHash ? 'password_hash, password_reset_token' : '';

  try {
    row = await (
      await getPool()
    ).query(
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
          CASE
            WHEN role = ${userRole.administrator} THEN "Administrator"
            WHEN role = ${userRole.staff} THEN "Staff"
            WHEN role = ${userRole.user} THEN "User"
            ELSE "Unknown role"
          END AS role_name,
          enabled,
          CASE
            WHEN enabled = ${userEnabled.active} THEN "Active"
            WHEN enabled = ${userEnabled.disabled} THEN "Disabled"
            ELSE "Unknown enabled"
          END AS enabled_name,
          status,
          CASE
            WHEN status = ${userStatus.active} THEN "Active"
            WHEN status = ${userStatus.deleted} THEN "Deleted"
            WHEN status = ${userStatus.pending} THEN "Pending"
            ELSE "Unknown status"
          END AS status_name,
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

    row = row[0] || [];

    // If user is found and to include permissions
    if (_.isEmpty(row) === false && includePermissions) {
      // If user role is staff
      if (row.role === userRole.staff) {
        // Retrieve permission users and append to the user
        row.permissions = await findPermissionUsers({
          searchOptions: {
            'permission_user.user_id': row.id
          }
        });
      } else {
        // If user role is not a staff, then just set a empty array
        row.permissions = [];
      }
    }
  } catch (e) {
    moduleLogger.error(e);
    throw e;
  }

  moduleLogger.debug({ row }, 'User row result');

  return row;
};

/**
 * Update existing user
 */
const updateOne = async (id, row) => {
  let result = false;

  const fields = [];
  const values = [];
  _.forIn(row, (value, key) => {
    if (key === 'password') {
      if (_.isEmpty(value) === false) {
        fields.push('password_hash = ?');
        values.push(bcrypt.hashSync(row.password, bcrypt.genSaltSync(config.get('bcryptSaltingRound'))));
      }
    } else if (key !== 'id') {
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
    result: true,
    id
  };
};

/**
 * Delete existing user
 */
const deleteOne = async id => {
  let result = false;

  try {
    result = await (
      await getPool()
    ).query(
      `
        UPDATE user
        SET status = ?
        WHERE id = ?
      `,
      [userStatus.deleted, id]
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

// Set user roles based on the request type
//    - staff: [administrator, staff]
//    - user: [user]
const getUserRoles = roleType => (roleType === 'staff' ? [userRole.administrator, userRole.staff] : [userRole.user]);

module.exports = { findAll, insertOne, getOne, updateOne, deleteOne, userRole, userStatus, userEnabled, getUserRoles };
