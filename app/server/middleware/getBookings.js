const knex = require('../../database/knex');
const client = require('../redis');
const Promise = require('bluebird');

const getBookings = (listingId) => {
  // CHECK CACHE
  return client.getAsync(listingId)
    .then((availability) => {
      if (availability) {
        return Promise.try(() => {
          return availability;
        });
      }
      // CHECK DB
      return knex.select('date').from('booking_dates').where({ listing_id: listingId }).union(function() {
        this.select('date').from('blackout_dates').where({ listing_id: listingId });
      })
        .orderBy('date')
        .then((dates) => {
          client.setex(listingId, 60, JSON.stringify(dates));
          return dates;
        });
    });
};

module.exports = getBookings;
