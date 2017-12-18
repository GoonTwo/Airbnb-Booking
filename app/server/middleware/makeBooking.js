const knex = require('../../database/knex');
const moment = require('moment');
const datesBetween = require('dates-between');
const Promise = require('bluebird');

function getDates(beginDate, endDate) {
  const dateArray = [];
  let currentDate = moment(beginDate);
  const stopDate = moment(endDate);
  while (currentDate <= stopDate) {
    dateArray.push(moment(currentDate).format('YYYY-MM-DD'));
    currentDate = moment(currentDate).add(1, 'days');
  }
  return dateArray;
}

const makeBooking = (req, res, next) => {
  const { listingId, userId, startDate, endDate } = req.body;

  const requestedDates = getDates(startDate, endDate);

  knex.select('date').from('booking_dates').where({ listing_id: listingId }).whereIn('date', requestedDates)
    .then((matchedDates) => {
      if (matchedDates.length > 0) {
        res.status(409).send('booking conflict');
      }
    })
    .then(() => {
      knex.select('date').from('blackout_dates').where({ listing_id: listingId }).whereIn('date', requestedDates)
        .then((matchedDates) => {
          if (matchedDates.length > 0) {
            res.status(409).send('blackout conflict');
          }
        });
    })
    .then(() => {
      // make bookings
      knex.select('price').from('prices').where({ listing_id: listingId }).then((price) => {
        knex.transaction((trx) => {
          return trx
            .insert({
              listing_id: listingId,
              user_id: userId,
              start_date: startDate,
              end_date: endDate,
              total_cost: (price * requestedDates.length).toFixed(2),
            })
            .then(() => {
              return Promise.map(requestedDates, (date) => {
                return trx.insert({
                  listing_id: listingId,
                  date,
                }).into('books');
              });
            })
            .then(trx.commit)
            .catch(trx.rollback);
        })
          .then((inserts) => {
            console.log(`${inserts.length} new booking days saved.`);
            res.json({
              listingId,
              userId,
              price,
              startDate,
              endDate,
            });
          })
          .catch((error) => {
            console.error(error);
            res.status(409).send('no conflicts, but booking was still unsuccesfull');
          });
      });
    });
};

// SELECT date FROM booking_dates WHERE listing_id = 1 AND date IN ('2017-01-04');

module.exports = makeBooking;
