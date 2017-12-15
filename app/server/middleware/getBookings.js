const knex = require('../../database/knex');
const redis = require('redis');

const client = redis.createClient();

const getBookings = (req, res, next) => {
  return knex.from('bookings')
    .innerJoin('dates', 'bookings.date_id', 'dates.id')
    .where('list_id', req.params.list_id)
    .then((booking) => {
      const availability = booking.reduce((acc, el) => {
        if (acc[el.list_id]) {
          acc[el.list_id].push(el.date);
        } else {
          acc[el.list_id] = [el.date];
        }
        return acc;
      }, {});
      req.bookings = availability;
      client.setex(req.params.list_id, 60, JSON.stringify(availability));
      next();
    });
};

module.exports = getBookings;
