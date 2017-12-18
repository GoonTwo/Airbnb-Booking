const knex = require('../../database/knex');
const redis = require('redis');

const client = redis.createClient();

const getBookings = (req, res, next) => {
  return knex.from('bookings')
    .innerJoin('dates', 'bookings.date_id', 'dates.id')
    .where('listing_id', req.params.listingId)
    .then((booking) => {
      const availability = booking.reduce((acc, el) => {
        if (acc[el.listing_id]) {
          acc[el.listing_id].push(el.date);
        } else {
          acc[el.listing_id] = [el.date];
        }
        return acc;
      }, {});
      req.bookings = availability;
      client.setex(req.params.listingId, 60, JSON.stringify(availability));
      next();
    });
};

module.exports = getBookings;

// SELECT date from booking_dates WHERE listing_id = 1 UNION SELECT date from blackout_dates WHERE listing_id = 1 ORDER BY date;
