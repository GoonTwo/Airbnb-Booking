const knex = require('../../database/knex');
const redis = require('redis');

const client = redis.createClient();

const getBookings = (req, res) => {
  const { listingId } = req.params;
  knex.select('date').from('booking_dates').where({ listing_id: listingId }).union(function() {
    this.select('date').from('blackout_dates').where({ listing_id: listingId });
  })
    .orderBy('date')
    .then((dates) => {
      client.setex(listingId, 60, JSON.stringify(dates));
      res.json(dates);
    });
};

module.exports = getBookings;

// SELECT date from booking_dates WHERE listing_id = 1 UNION SELECT date from blackout_dates WHERE listing_id = 1 ORDER BY date;
