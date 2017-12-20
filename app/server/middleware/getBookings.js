const knex = require('../../database/knex');
const redis = require('redis');
const bookingsCache = require('./bookingsCache');

const client = redis.createClient();

const getBookings = (listingId) => {
  // CHECK CACHE
  const avaiability = bookingsCache(listingId);
  if (avaiability) return avaiability;

  // CHECK DB
  return knex.select('date').from('booking_dates').where({ listing_id: listingId }).union(function() {
    this.select('date').from('blackout_dates').where({ listing_id: listingId });
  })
    .orderBy('date')
    .then((dates) => {
      client.setex(listingId, 60, JSON.stringify(dates));
      return dates;
    });
};

module.exports = getBookings;

