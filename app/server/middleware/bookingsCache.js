const redis = require('redis');

const client = redis.createClient();

module.exports = (listingId) => {
  client.get(listingId, (err, data) => {
    if (err) throw err;

    if (data != null) {
      return data;
    }
    return null;
  });
};
