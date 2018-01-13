const knex = require('../../database/knex');
const moment = require('moment');
const Promise = require('bluebird');
const now = require('performance-now');

let bookingId = '';

function getDates(beginDate, endDate) {
  const dateArray = [];
  let currentDate = moment(beginDate);
  const stopDate = moment(endDate);
  while (currentDate <= stopDate) {
    dateArray.push(`${moment(currentDate).format('YYYY-MM-DD')}`);
    currentDate = moment(currentDate).add(1, 'days');
  }
  return dateArray;
}


const makeBooking = (job, done) => {
  const start = now();
  const { listingId, userId, startDate, endDate } = job.data;
  const requestedDates = getDates(startDate, endDate);
  
  const query = `WITH booking_dates_subquery AS ( 
    SELECT * from booking_dates WHERE listing_id = ${listingId} 
  ), 
  blackout_dates_subquery AS ( 
    SELECT * from blackout_dates WHERE listing_id = ${listingId} 
  ), 
  combined_dates AS ( 
    SELECT date FROM blackout_dates_subquery 
    UNION
    SELECT date FROM booking_dates_subquery 
  )
  SELECT * FROM combined_dates WHERE date IN (${requestedDates.map(date => `'${date}'`).join(', ')})`;
  
  knex.raw(query)
    .then((matchedDates) => {
      if (matchedDates.rows.length > 0) {
        throw new Error('booking conflict');
      }
    })
    .then(() => {
      return knex.select('price').from('prices').where({ listing_id: listingId }).then((price) => {
        const totalCost = (price[0].price * requestedDates.length).toFixed(2);
        knex.transaction((trx) => {
          return trx
            .insert({
              listing_id: listingId,
              user_id: userId,
              start_date: startDate,
              end_date: endDate,
              total_cost: totalCost,
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
            const end = now();
            // res.json({
            //   bookingId,
            //   listingId,
            //   userId,
            //   totalCost,
            //   startDate,
            //   endDate,
            // });
            // console.log(`${inserts.length} booking dates saved`);
            console.log((end - start).toFixed(3));
            done();
          });
      });
    })
    .catch((error) => {
      return done(new Error('booking unavailable'));
    });
};

module.exports = makeBooking;
