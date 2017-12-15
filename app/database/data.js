/* eslint-disable */
const knex = require('./knex');
const moment = require('moment');
const faker = require('faker');
const datesBetween = require('dates-between');

const startDate = new Date('2017-01-01');
const endDate = new Date('2018-01-01');

const data = {
  dates: [],
  bookings: [],
};

for (const date of datesBetween(startDate, endDate)) {
  let newdate = moment(date).format('L');
  data.dates.push({
    date: newdate
  });
}
const dateTracker = {};

for (let i = 1; i <= 10000000; i += 1) {

  const booking = {
    list_id: Math.floor(Math.random() * 40000),
    guest_id: Math.floor(Math.random() * 1000000),
  };

  dateTracker[booking.list_id] = dateTracker[booking.list_id] || {};

  do {
    var date_id = Math.floor((Math.random() * 364) + 1);
  } while (dateTracker[booking.list_id][date_id])
  
  booking.date_id = date_id;

  data.bookings.push(booking);
  dateTracker[booking.list_id][date_id] = true;

  if (i % 100000 === 0) {
    console.log('generated :' + i);
  }
}

knex.batchInsert('dates', data.dates, 1000)


knex.batchInsert('bookings', data.bookings, 1000).then(() => {
  console.log('done');
})


module.exports = data;

