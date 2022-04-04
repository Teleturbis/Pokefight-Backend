// Update with your config settings.
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  elephant: {
    client: 'postgresql',
    connection: `postgres://${process.env.DB_ELEPHANT_DB}:${process.env.DB_ELEPHANT_PW}@${process.env.DB_ELEPHANT_HOST}/${process.env.DB_ELEPHANT_DB}`,
    pool: {
      min: 2,
      max: 5,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
