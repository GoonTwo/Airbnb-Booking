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
  return date;
}

function randomEndDate(bookingStart) {
  var result = new Date(bookingStart);
  result.setDate(result.getDate() + (Math.floor(Math.random() * 3) + 1));
  return result;
}

function bookingConflict(startDate, endDate) {
  const attemptedBookingDates = [];
  for (const date of datesBetween(startDate, endDate)) {
    let newDate = moment(date).format('YYYY-MM-DD');
    attemptedBookingDates.push(newDate);
  }
  for (var i = 0; i < attemptedBookingDates.length; i++) {
    if (bookingTracker[attemptedBookingDates[i]]) return true;
  }
  return false;
}

function addBookings(startDate, endDate) {
  const dates = [];
  for (const date of datesBetween(startDate, endDate)) {
    let newDate = moment(date).format('YYYY-MM-DD');
    dates.push(newDate);
    bookingTracker[moment(date).format('YYYY-MM-DD')] = true;
  }
  bookingDates.push({
    startDate: moment(startDate).format('YYYY-MM-DD'),
    endDate: moment(endDate).format('YYYY-MM-DD'),
    dates,
  })
}

// --------------------------
// ---- MAKE BOOKING DATES ------
// --------------------------
const bookingTracker = {};
const bookingDates = [];

for (var i = 0; i < 100; i++) {
  do {
    var bookingStart = randomBeginDate();
    var bookingEnd = randomEndDate(bookingStart);
  } while (bookingConflict(bookingStart, bookingEnd))
  addBookings(bookingStart, bookingEnd)
}

// ----------------------------
// ---- MAKE BLACKOUT DATES ---
// ----------------------------
const blackoutDates = [];

do {
  var blackoutStart = randomBeginDate();
  var blackoutEnd = randomEndDate(blackoutStart);
} while (bookingConflict(blackoutStart, blackoutEnd))

for (const date of datesBetween(new Date(blackoutStart), new Date(blackoutEnd))) {
  let newDate = moment(date).format('YYYY-MM-DD');
  blackoutDates.push(newDate);
}

for (let listing_id = 1; listing_id <= 10; listing_id += 1) {
  // --------------------------
  // --------- PRICES ---------
  // --------------------------
  data.prices.push({
    listing_id: listing_id,
    price: Math.floor((Math.random() * 50) + 20),
  });
  
  // --------------------------
  // ----- BLACKOUT DATES ------
  // --------------------------

  for (var i = 0; i < blackoutDates.length; i++) {
    data.blackoutDates.push({
      listing_id: listing_id,
      date: blackoutDates[i],
    });
  }
  bookingDates.forEach((booking) => {
    // --------------------
    // ----- BOOKINGS -----
    // --------------------

    const newBooking = {
      listing_id: listing_id,
      user_id: Math.floor(Math.random() * 1000000),
      total_cost: Math.floor((Math.random() * 100) + 50),
      start_date: booking.startDate,
      end_date: booking.endDate,
    };

    data.bookings.push(newBooking);
    // --------------------------
    // ----- BOOKING DATES ------
    // --------------------------

    for (var i = 0; i < booking.dates.length; i++) {
      data.bookingDates.push({
        listing_id: listing_id,
        date: booking.dates[i],
      });
    }
  })

  if (listing_id % 1000 === 0) {
    console.log(`finished ${listing_id} listings`)
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

