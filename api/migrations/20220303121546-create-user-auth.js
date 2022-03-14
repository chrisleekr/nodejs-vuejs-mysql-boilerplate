let dbm;
let type;
let seed;

let Promise;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = (options, seedLink) => {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
  Promise = options.Promise;
};

exports.up = db =>
  // Create new table user_auth
  db
    .createTable('user_auth', {
      id: { type: 'bigint', length: 11, primaryKey: true, autoIncrement: true },
      user_id: {
        type: 'bigint',
        length: 11,
        foreignKey: {
          name: 'user_user_id_fk',
          table: 'user',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT'
          },
          mapping: 'id'
        }
      },
      auth_key: { type: 'string', length: 255, notNull: true },
      auth_key_expired_at: { type: 'timestamp', notNull: true },
      refresh_auth_key: { type: 'string', length: 255, notNull: true },
      refresh_auth_key_expired_at: { type: 'timestamp', notNull: true },
      status: { type: 'tinyint', defaultValue: 1 },
      // eslint-disable-next-line no-new-wrappers
      created_at: { type: 'timestamp', defaultValue: new String('CURRENT_TIMESTAMP') },
      updated_at: { type: 'timestamp' }
    })
    .then(() => {
      db.runSql(
        // eslint-disable-next-line max-len
        'ALTER TABLE `user_auth` CHANGE COLUMN `updated_at` `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`'
      );
    });

exports.down = db => db.dropTable('user_auth');

exports._meta = {
  version: 1
};
