const bookshelf = require('./bookshelf');

const Booking = bookshelf.Model.extend({
  tableName: 'bookings',
  bookings() {
    return this.belongsTo(Day);
  },
});

const Day = bookshelf.Model.extend({
  tableName: 'days',
  days() {
    return this.hasMany(Booking);
  },
});
