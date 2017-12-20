/* eslint-disable */

exports.up = function (knex, Promise) {
  return Promise.all([

    knex.schema.createTable('bookings', function (table) {
      table.increments('id').index().primary();
      table.integer('listing_id').index().notNullable();
      table.integer('user_id').index().notNullable();
      table.string('start_date').notNullable();
      table.string('end_date').notNullable();
      table.decimal('total_cost').notNullable();
    }),

    knex.schema.createTable('booking_dates', function (table) {
      table.increments('id').primary();
      table.integer('listing_id').index().notNullable();
      table.string('date').index().notNullable();
    }),

    knex.schema.createTable('blackout_dates', function (table) {
      table.increments('id').primary();
      table.integer('listing_id').index().notNullable();
      table.string('date').notNullable();
    }),

    knex.schema.createTable('prices', function (table) {
      table.increments('id').primary();
      table.integer('listing_id').index().notNullable();
      table.decimal('price').notNullable();
    })

  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('bookings'),
    knex.schema.dropTable('booking_dates'),
    knex.schema.dropTable('blackout_dates'),
    knex.schema.dropTable('prices'),
  ]);
};
