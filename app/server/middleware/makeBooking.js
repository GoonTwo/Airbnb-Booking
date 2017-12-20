const knex = require('../../database/knex');
const moment = require('moment');
const Promise = require('bluebird');

let bookingId = '';

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


const makeBooking = (req, res) => {
  const { listingId, userId, startDate, endDate } = req.body;
  const requestedDates = getDates(startDate, endDate);
  knex.select('date').from('booking_dates').where({ listing_id: listingId }).whereIn('date', requestedDates)
    .then((matchedDates) => {
      if (matchedDates.length > 0) {
        throw new Error('booking conflict');
      }
    })
    .then(() => {
      return knex.select('date').from('blackout_dates').where({ listing_id: listingId }).whereIn('date', requestedDates)
        .then((matchedDates) => {
          if (matchedDates.length > 0) {
            throw new Error('booking conflict');
          }
        });
    })
    .then(() => {
      return knex.select('price').from('prices').where({ listing_id: listingId }).then((price) => {
        knex.transaction((trx) => {
          return trx
            .insert({
              listing_id: listingId,
              user_id: userId,
              start_date: startDate,
              end_date: endDate,
              total_cost: (price[0].price * requestedDates.length).toFixed(2),
            }, 'id')
            .into('bookings')
            .then((ids) => {
              [bookingId] = ids;
              return Promise.map(requestedDates, (date) => {
                return trx.insert({
                  listing_id: listingId,
                  date,
                }).into('booking_dates');
              });
            })
            .then(trx.commit)
            .catch(trx.rollback);
        })
          .then((inserts) => {
            // console.log(`${inserts.length} new bookings.`);
            res.json({
              bookingId,
              listingId,
              userId,
              totalCost: (price[0].price * requestedDates.length).toFixed(2),
              startDate,
              endDate,
            });
          });
      });
    })
    .catch((error) => {
      res.status(409).end('no conflicts, but booking was still unsuccesfull');
    });
};

module.exports = makeBooking;
