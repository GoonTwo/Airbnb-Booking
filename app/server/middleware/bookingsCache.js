const redis = require('redis');

const client = redis.createClient();

module.exports = (req, res, next) => {
  const listing = req.params.listingId;
  client.get(listing, (err, data) => {
    if (err) throw err;

    if (data != null) {
      res.json(JSON.parse(data));
    } else {
      next();
    }
  });
};
