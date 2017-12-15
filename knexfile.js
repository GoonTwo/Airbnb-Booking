module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'dannywelstad',
      database: 'booking',
    },
    migration: {
      directory: './app/database/migrations',
    },
    seeds: {
      directory: './app/database/seeds',
    },
  },
  production: {
    client: 'pg',
    connection: {
      host: 'postgres',
      user: 'postgres',
      database: 'booking',
      password: process.env.POSTGRES_PASSWORD,
    },
    migration: {
      directory: './app/database/migrations',
    },
    seeds: {
      directory: './app/database/seeds',
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
      directory: './app/database/migrations',
    },
    seeds: {
      directory: './app/database/seeds',
    },
  },
};

