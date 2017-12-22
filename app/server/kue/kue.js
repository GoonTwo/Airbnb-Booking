const kue = require('kue');
const queue = kue.createQueue();

const job = queue.create('makeBooking', {
  title: 'welcome email for tj',
  to: 'tj@learnboost.com',
  template: 'welcome-email',
}).priority('high').attempts(2).save((err) => {
  if (!err) console.log(job.id);
});

queue.process('makeBookings', (job, done) => {
  email(job.data.to, done);
});

function email(address, done) {
  if (!isValidEmail(address)) {
    return done(new Error('invalid to address'));
  }
  // email send stuff...
  done();
}

job.on('complete', (result) => {
  console.log('Job completed with data ', result);
}).on('failed attempt', (errorMessage, doneAttempts) => {
  console.log('Job failed');
}).on('failed', (errorMessage) => {
  console.log('Job failed');
}).on('progress', (progress, data) => {
  console.log('\r  job #' + job.id + ' ' + progress + '% complete with data ', data);
});