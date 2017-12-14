/* eslint-disable */

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('bookings').del()
    .then(function () {
      // Inserts seed entries
      return knex('bookings').insert([
        { date_id: 1, guest_id: 1, list_id: 1 }, 
        { date_id: 2, guest_id: 1, list_id: 1 }, 
        { date_id: 3, guest_id: 1, list_id: 1 }, 

        { date_id: 1, guest_id: 2, list_id: 2 },
        { date_id: 2, guest_id: 2, list_id: 2 },
        { date_id: 3, guest_id: 2, list_id: 2 }, 
      ]);
    });
};