/* eslint-disable */
const knex = require('./knex');
const moment = require('moment');
const datesBetween = require('dates-between');

// get booking dates between
const startDate = new Date('2017-01-01');
const endDate = new Date('2018-01-01');

const data = {
  bookings: [],
  bookingDates: [],
  blackoutDates: [],
  prices: [],
};

function randomBeginDate() {
  const date = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
  return moment(date).format('YYYY-MM-DD');
}

function randomEndDate(bookingStart) {
  return moment(bookingStart).add(`${(Math.floor(Math.random() * 7) + 1)}`, 'days').format('YYYY-MM-DD')
}

function bookingConflict(startDate, endDate, listing_id) {
  const attemptedBookingDates = [];
  for (const date of datesBetween(new Date(startDate), new Date(endDate))) {
    let newDate = moment(date).format('YYYY-MM-DD');
    attemptedBookingDates.push(newDate);
  }
  for (var i = 0; i < attemptedBookingDates.length; i++) {
    if (bookingTracker[listing_id][attemptedBookingDates]) return true;
  }
  return false;
}

function addBookings(startDate, endDate, listing_id) {
  const newBookingDates = [];
  for (const date of datesBetween(new Date(startDate), new Date(endDate))) {
    let newDate = moment(date).format('YYYY-MM-DD');
    newBookingDates.push(newDate);
  }
  for (var i = 0; i < newBookingDates.length; i++) {
    bookingTracker[listing_id][newBookingDates[i]] = true;
  }
}

var beginDate = randomBeginDate();
var endingDate = randomEndDate(beginDate);

const bookingTracker = {};

for (let i = 1; i <= 10000; i += 1) {

  // --------------------
  // ----- BOOKINGS -----
  // --------------------

  const bookingStart = randomBeginDate();
  const bookingEnd = randomEndDate(bookingStart);
  const listing_id = Math.floor(Math.random() * 40000);

  const booking = {
    listing_id: listing_id,
    user_id: Math.floor(Math.random() * 1000000),
    total_cost: Math.floor((Math.random() * 100) + 50),
    start_date: '',
    end_date: '',
  };

  bookingTracker[booking.listing_id] = bookingTracker[booking.listing_id] || {};

  do {
    const bookingStart = randomBeginDate();
    const bookingEnd = randomEndDate(bookingStart);
  } while (bookingConflict(bookingStart, bookingEnd, listing_id))
  
  addBookings(bookingStart, bookingEnd, listing_id)

  booking.start_date = bookingStart;
  booking.end_date = bookingEnd;

  data.bookings.push(booking);

  // --------------------------
  // ----- BOOKING DATES ------
  // --------------------------

  for (const date of datesBetween(new Date(bookingStart), new Date(bookingEnd))) {
    let newDate = moment(date).format('YYYY-MM-DD');
    data.bookingDates.push({
      listing_id: listing_id,
      date: newDate,
    });
  }

  // --------------------------
  // --------- PRICES ---------
  // --------------------------

  data.prices.push({
    listing_id: listing_id,
    price: Math.floor((Math.random() * 50) + 20),
  })

  if (i % 1000 === 0) {
    console.log('generated :' + i);
  }
}

knex.batchInsert('bookings', data.bookings, 1000).then(() => {
  console.log('done with bookings');
}).then(() => {
  return knex.batchInsert('booking_dates', data.bookingDates, 1000)
}).then(() => {
  console.log('done with booked days')
}).then(() => {
  return knex.batchInsert('prices', data.prices, 1000)
}).then(() => {
  console.log('done with prices');
}).then(() => {
  return knex.batchInsert('blackout_dates', data.blackoutDates, 1000)
}).then(() => {
  console.log('done with blackout dates');
})

