const _ = require('lodash');
const { getPool } = require('../helpers/database');
const { logger } = require('../helpers/logger');

const moduleLogger = logger.child({ module: 'permissionModel' });

/**
 * Find all permissions
 */
const findAll = async ({ searchOptions = {}, orderBy = 'permission_key ASC' } = {}) => {
  moduleLogger.debug({ searchOptions, orderBy }, 'findAll called');

  let rows = [];
  const where = [];
  const values = [];

  _.forIn(searchOptions, (value, key) => {
    if (key === 'q') {
      if (value) {
        where.push(`(key LIKE ? OR description LIKE ?)`);
        _.times(2, () => {
          values.push(`%${value}%`);
        });
      }
    } else {
      where.push(`${key} = ?`);
      values.push(value);
    }
  });

  let query = `
    SELECT
      id,
      permission_key,
      description,
      data,
      created_at,
      updated_at
    FROM permission`;

  if (where.length) {
    query += `
        WHERE
            ${_.join(where, ' AND ')}
    `;
  }

  if (orderBy) {
    query += `
        ORDER BY
        ${orderBy}
    `;
  }

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
 * Insert new permission
 */
const insertOne = async row => {
  let result = false;

  try {
    result = await (
      await getPool()
    ).query(
      `
        INSERT INTO permission (
          permission_key,
          description,
          data
        ) VALUES (
          ?,
          ?,
          ?
        );
      `,
      [row.permission_key, row.description, row.data]
    );
  } catch (e) {
    moduleLogger.error(e);
    throw e;
  }

  moduleLogger.debug({ result }, 'Inserted permission result');

  return {
    result: true,
    id: result.insertId
  };
};

/**
 * Retrieve existing permission
 */
const getOne = async ({ searchOptions = {} } = {}) => {
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
          permission_key,
          description,
          data,
          created_at,
          updated_at
        FROM
          permission
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

  moduleLogger.debug({ row }, 'Permission row result');

  return row[0] || [];
};

/**
 * Update existing permission
 */
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
          permission
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

  moduleLogger.debug({ result }, 'Update permission result');

  return {
    result: true,
    id
  };
};

/**
 * Delete existing permission
 */
const deleteOne = async id => {
  let result = false;

  try {
    result = await (
      await getPool()
    ).query(
      `
        DELETE FROM permission
        WHERE id = ?
      `,
      [id]
    );
  } catch (e) {
    moduleLogger.error(e);
    throw e;
  }

  moduleLogger.debug({ result }, 'Delete permission result');

  return {
    result: true
  };
};

/**
 * Find permission users that are matching with search options
 */
const findPermissionUsers = async ({ searchOptions = {} } = {}) => {
  moduleLogger.debug({ searchOptions }, 'findPermissionUsers called');

  let rows = [];
  const where = [];
  const values = [];

  _.forIn(searchOptions, (value, key) => {
    where.push(`${key} = ?`);
    values.push(value);
  });

  try {
    rows = await (
      await getPool()
    ).query(
      `
          SELECT
              permission.id,
              permission_user.user_id,
              permission.permission_key,
              permission.description,
              permission.data,
              permission.created_at,
              permission.updated_at
          FROM
            permission_user
          INNER JOIN permission ON permission_user.permission_id = permission.id
          WHERE
            ${_.join(where, ' AND ')}
        `,
      values
    );
  } catch (e) {
    moduleLogger.error(e);
    throw e;
  }

  moduleLogger.debug({ rows }, 'Permission users row result');

  return rows || [];
};

/**
 * Replace permission users using insert on duplicate key update
 */
const replacePermissionUser = async row => {
  moduleLogger.debug({ row }, 'replacePermissionUser called');

  let result = false;

  try {
    result = await (
      await getPool()
    ).query(
      `
      INSERT INTO permission_user (
        permission_id,
        user_id,
        data
      ) VALUES (
        ?,
        ?,
        ?
      )
      ON DUPLICATE KEY UPDATE
        data = VALUES(data)
      `,
      [row.permission_id, row.user_id, row.data]
    );
  } catch (e) {
    moduleLogger.error(e);
    throw e;
  }

  moduleLogger.debug({ result }, 'Inserted permission user result');

  return {
    result: true,
    id: result.insertId
  };
};

/**
 * Delete permission users that matches search options
 */
const deletePermissionUsers = async searchOptions => {
  let result = false;

  const where = [];
  const values = [];

  _.forIn(searchOptions, (value, key) => {
    if (key === 'exclude_permission_ids') {
      if (_.isEmpty(value) === false) {
        where.push('(permission_id NOT IN (?))');
        values.push(value);
      }
    } else {
      where.push(`${key} = ?`);
      values.push(value);
    }
  });

  if (_.isEmpty(where)) {
    return {
      result: false,
      message: 'The delete operation requires at least one where clause.'
    };
  }

  try {
    result = await (
      await getPool()
    ).query(
      `
        DELETE FROM
          permission_user
        WHERE
          ${_.join(where, ' AND ')}
      `,
      values
    );
  } catch (e) {
    moduleLogger.error(e);
    throw e;
  }

  moduleLogger.debug({ result }, 'Delete permission user result');

  return {
    result: true
  };
};

/**
 * Refresh permission users
 *  - Keep only provided permission id
 */
const refreshPermissionUsers = async (userId, permissionIds) => {
  moduleLogger.debug({ userId, permissionIds }, 'upsertPermissionUsers called');

  // insert into ignore
  const promises = _.map(permissionIds, async permissionId => {
    await replacePermissionUser({
      permission_id: permissionId,
      user_id: userId,
      data: JSON.stringify({})
    });
  });

  // delete not applicable
  promises.push(
    deletePermissionUsers({
      exclude_permission_ids: permissionIds,
      user_id: userId
    })
  );

  return Promise.all(promises);
};

module.exports = {
  findAll,
  insertOne,
  getOne,
  updateOne,
  deleteOne,
  findPermissionUsers,
  refreshPermissionUsers
};
