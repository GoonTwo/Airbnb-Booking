/* eslint-disable */

exports.up = function (knex, Promise) {
  return Promise.all([

    knex.schema.createTable('dates', function (table) {
      table.increments('id');
      table.string('date').notNullable();
    }),

    knex.schema.createTable('bookings', function (table) {
      table.increments('id').primary();
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
      table.integer('date_id').references('id').inTable('dates');
      table.integer('guest_id').notNullable();
      table.integer('list_id').index().notNullable();
    })

  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('bookings'),
    knex.schema.dropTable('dates'),
  ]);
};
