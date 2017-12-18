require('newrelic');

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const getBookings = require('./middleware/getBookings');
const bookingsCache = require('./middleware/bookingsCache');
const makeBooking = require('./middleware/makeBooking');

const app = express();
app.use(bodyParser.json());
// app.use(morgan('tiny'));

const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
  res.json('you made it!');
});

app.get('/bookings/:listingId', bookingsCache, getBookings, (req, res) => {
  res.json(req.bookings);
});


app.post('/bookings', makeBooking, (req, res) => {
console.log('post to bookings attempted')
});

app.listen(PORT, () => console.log(`server listening on PORT ${PORT}`));

module.exports = app;


// select guest_id, list_id, date from bookings INNER JOIN dates ON dates.id = bookings.date_id where list_id = 72 order by date;
