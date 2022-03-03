const _ = require('lodash');
const { getPool, fetchWithPagination } = require('../helpers/database');
const { logger } = require('../helpers/logger');

const moduleLogger = logger.child({ module: 'todoModel' });

const todoState = {
  pending: 'pending',
  ongoing: 'ongoing',
  completed: 'completed',
  archived: 'archived'
};

const todoStatus = {
  active: 1,
  deleted: 0
};

const findAll = async ({ searchOptions = {}, orderBy = 'position ASC', page = 1, pageSize = 10 } = {}) => {
  moduleLogger.debug({ searchOptions, orderBy, page, pageSize }, 'findAll called');

  let result = { rows: [], pagination: {} };
  const where = [];
  const values = [];

  where.push('status = ?');
  values.push(todoStatus.active);

  _.forIn(searchOptions, (value, key) => {
    if (key === 'q') {
      if (value) {
        where.push(`(name LIKE ? OR note LIKE ?)`);
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
      user_id,
      name,
      note,
      position,
      state,
      created_at,
      updated_at
    FROM todo
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

const getMaxPosition = async ({ searchOptions = {} } = {}) => {
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
            MAX(position) AS max_position
          FROM
            todo
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

  row = row[0] ? row[0] : {};

  moduleLogger.debug({ row, position: row.max_position !== null ? row.max_position + 1 : 1 }, 'Todo row result');

  return row.max_position !== null ? row.max_position + 1 : 1;
};

const insertOne = async row => {
  let result = false;

  try {
    result = await (
      await getPool()
    ).query(
      `
        INSERT INTO todo (
          user_id,
          name,
          note,
          position,
          state,
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
      [row.user_id, row.name, row.note, row.position, row.state, row.status]
    );
  } catch (e) {
    moduleLogger.error(e);
    throw e;
  }

  moduleLogger.debug({ result }, 'Inserted todo result');

  return {
    result: true,
    id: result.insertId
  };
};

const getOne = async ({ searchOptions = {}, includeDeletedTodo = false } = {}) => {
  let row = {};
  const where = [];
  const values = [];

  if (!searchOptions.status && includeDeletedTodo === false) {
    where.push('status != ?');
    values.push(todoStatus.deleted);
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
          user_id,
          name,
          note,
          state,
          status,
          created_at,
          updated_at
        FROM
          todo
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

  moduleLogger.debug({ row }, 'Todo row result');

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
          todo
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

  moduleLogger.debug({ result }, 'Update todo result');

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
        UPDATE todo
        SET status = ?
        WHERE id = ?
      `,
      [todoStatus.deleted, id]
    );
  } catch (e) {
    moduleLogger.error(e);
    throw e;
  }

  moduleLogger.debug({ result }, 'Delete todo result');

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
        UPDATE todo
        SET status = ?
        WHERE
          ${_.join(where, ' AND ')}
      `,
      [todoStatus.deleted, ...values]
    );
  } catch (e) {
    moduleLogger.error(e);
    throw e;
  }

  moduleLogger.debug({ result }, 'Delete todo result');

  return {
    result: true
  };
};

const upsertBulk = async (rows, { deleteNotInListOfState = '' } = {}) => {
  moduleLogger.debug({ rows, deleteNotInListOfState }, 'Upsert bulk');

  let promiseResult = [];
  const promiseArray = [];
  _.forEach(rows, row => {
    if (row.id !== null) {
      promiseArray.push(updateOne(row.id, row));
    } else {
      promiseArray.push(insertOne(row));
    }
  });

  promiseResult = await Promise.all(promiseArray);

  const ids = [];
  _.map(promiseResult, result => {
    ids.push(result.id);
  });

  moduleLogger.debug({ promiseResult, ids }, 'Upsert result');

  if (deleteNotInListOfState !== '') {
    // Remove rows that are not in the list
    await deleteAll({
      searchOptions: {
        excludeIds: ids,
        state: deleteNotInListOfState
      }
    });
  }
  return {
    result: true,
    id: ids
  };
};

module.exports = {
  findAll,
  insertOne,
  getOne,
  updateOne,
  deleteOne,
  deleteAll,
  todoState,
  todoStatus,
  getMaxPosition,
  upsertBulk
};
