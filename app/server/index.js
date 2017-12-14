const express = require('express');
const bodyParser = require('body-parser');

const getBookings = require('./helpers/getBookings');
const makeBooking = require('./helpers/makeBooking');


const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;
app.get('/', (req, res) => {
  res.send('hello world!!!');
});

app.get('/booking/:list_id', (req, res) => {
  getBookings(req.params.list_id)
    .then((availability) => {
      res.json(availability);
    });
});

app.post('/booking/:list_id', (req, res) => {
  makeBooking(req, res);
});

app.listen(PORT, () => console.log(`server listening on PORT ${PORT}`));

module.exports = app;


// select guest_id, list_id, date from bookings INNER JOIN dates ON dates.id = bookings.date_id where list_id = 72 order by date;
