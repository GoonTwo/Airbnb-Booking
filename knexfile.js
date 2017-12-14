const path = require('path');

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'dannywelstad',
      database: 'booking',
    },
    migration: {
      directory: `${__dirname}/app/database/migrations`,
    },
    seeds: {
      directory: `${__dirname}/app/database/seeds`,
    },
  },
  production: {
    client: 'pg',
    connection: {
      host: 'database',
      user: process.env.DB_USER,
      password: process.env.DB_USER,
      database: process.env.POSTGRES_DB,
    },
    migration: {
      directory: path.join(__dirname, '/app/database/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '/app/database/seeds'),
    },
  },
  test: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'dannywelstad',
      database: 'booking_test',
    },
    migration: {
      directory: path.join(__dirname, '/app/database/migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '/app/database/seeds'),
    },
  },
};

