const knex = require('knex')({
  client: 'pg',
  connection: {
    host: 'database',
    user: process.env.DB_USER,
    database: process.env.POSTGRES_DB,
    charset: 'utf8',
  },
});

module.exports = require('bookshelf')(knex);
