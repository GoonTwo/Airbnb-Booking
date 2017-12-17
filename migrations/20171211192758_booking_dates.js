/* eslint-disable */

exports.up = function (knex, Promise) {
  return Promise.all([

    knex.schema.createTable('bookings', function (table) {
      table.increments('id').primary();
      table.integer('listing_id').index().notNullable();
      table.integer('user_id').index().notNullable();
      table.date('start_date').notNullable();
      table.date('end_date').notNullable();
      table.decimal('total_cost').notNullable();
    }),

    knex.schema.createTable('booking_dates', function (table) {
      table.increments('id').primary();
      table.integer('listing_id').index().notNullable();
      table.date('date').notNullable();
    }),

    knex.schema.createTable('blackout_dates', function (table) {
      table.increments('id').primary();
      table.integer('listing_id').index().notNullable();
      table.date('date').notNullable();
    }),

    knex.schema.createTable('prices', function (table) {
      table.increments('id').primary();
      table.integer('listing_id').index().notNullable();
      table.decimal('price').index().notNullable();
    })

  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('bookings'),
    knex.schema.dropTable('booking_dates'),
    knex.schema.dropTable('blackout_dates'),
    knex.schema.dropTable('price'),
  ]);
};
