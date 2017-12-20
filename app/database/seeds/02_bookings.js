/* eslint-disable */

exports.seed = function(knex, Promise) {
  return knex('bookings').del()
    .then(function () {
      return knex('bookings').insert([
        { listing_id: 1, user_id: 1, start_date: '2017-01-01', end_date: '2017-01-05', total_cost: '250.00' }, 
      ]);
    });
};