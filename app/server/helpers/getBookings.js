const knex = require('../../database/knex');

const getBookings = (listId) => {
  return knex.from('bookings')
    .innerJoin('dates', 'bookings.date_id', 'dates.id')
    .where('list_id', listId)
    .then((booking) => {
      const availability = booking.reduce((acc, el) => {
        if (acc[el.list_id]) {
          acc[el.list_id].push(el.date);
        } else {
          acc[el.list_id] = [el.date];
        }
        return acc;
      }, {});
      return availability;
    });
};

module.exports = getBookings;
