import knex from 'knex';
import knexfile from './knexfile';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const db = knex(knexfile[process.env.DB_CONFIG]);

export default db;
