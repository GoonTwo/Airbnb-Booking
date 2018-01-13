const kue = require('kue');
const makeBooking = require('../middleware/makeBooking');

const queue = kue.createQueue();

const booking = (data, done) => {
  const job = queue
    .create('makeBooking', data)
    .priority('high')
    .removeOnComplete(true)
    .backoff({ type: 'exponential' })
    .attempts(1)
    .save((err) => {
      if (err) {
        console.error(err);
        done(err);
      }
      if (!err) {
        done();
      }
    });
};

queue.process('makeBooking', 1000, (job, done) => {
  makeBooking(job, done);
});

module.exports = {
  create: (data, done) => {
    booking(data, done);
  },
};
