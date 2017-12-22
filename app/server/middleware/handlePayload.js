const knex = require('../../database/knex');
const Promise = require('bluebird');

const createNewListing = (payload) => {
  const { listingId, price, blackoutDates } = payload;
  const updates = [];
  const newBlackoutDates = blackoutDates.map((blackoutDate) => {
    return {
      listing_id: listingId,
      date: blackoutDate,
    };
  });
  updates.push(knex('prices').insert({ listing_id: listingId, price }));
  updates.push(knex('blackout_dates').insert(newBlackoutDates));
  return Promise.all(updates);
};

const updateListing = (payload) => {
  const { listingId, price, blackoutDates } = payload;
  const updates = [];

  if (price) {
    updates.push(knex('prices').where('listing_id', '=', listingId).update({ price }));
  }

  if (blackoutDates) {
    const newBlackoutDates = blackoutDates.map((blackoutDate) => {
      return {
        listing_id: listingId,
        date: blackoutDate,
      };
    });
    updates.push(knex('blackout_dates')
      .where('listing_id', listingId)
      .del()
      .then(() => {
        knex('blackout_dates').insert(newBlackoutDates).then((inserts) => {
          // console.log(inserts);
        });
      }));
  }
  return Promise.all(updates);
};

const handlePayload = (payload) => {
  if (payload.isNew) {
    return createNewListing(payload);
  }
  return updateListing(payload);
};

module.exports = handlePayload;
