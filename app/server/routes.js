const express = require('express');
const AWS = require('aws-sdk');
const makeBooking = require('./middleware/makeBooking');
const config = require('../config');
const kue = require('kue');

const queue = kue.createQueue();

AWS.config.update({ region: 'us-east-2' });
const sns = new AWS.SNS();

const router = express.Router();

router.post('/bookings', (req, res) => {
  res.status(304).send();
  
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
  makeBooking(req, res);
});

router.get('/sendBooking', (req, res) => {
  const body = {
    listingId: 74771,
  };

  let payload = {
    default: JSON.stringify(body),
    APNS: {
      aps: {
        alert: JSON.stringify(body),
        sound: 'default',
        badge: 1,
      },
    },
  };

  // first have to stringify the inner APNS object...
  payload.APNS = JSON.stringify(payload.APNS);
  // then have to stringify the entire message payload
  payload = JSON.stringify(payload);

  sns.publish({
    Message: payload,
    MessageStructure: 'json',
    TargetArn: config.aws.requestArn,
  }, (err, data) => {
    if (err) {
      console.log(err.stack);
      res.send(err);
      return;
    }
    res.send(data);
  });
});

router.get('/sendUpdate', (req, res) => {
  const body = {
    isNew: false,
    listingId: '10000000',
    price: '110.00',
    blackoutDates: ['2017-02-12'],
  };

  let payload = {
    default: JSON.stringify(body),
    APNS: {
      aps: {
        alert: JSON.stringify(body),
        sound: 'default',
        badge: 1,
      },
    },
  };

  // first have to stringify the inner APNS object...
  payload.APNS = JSON.stringify(payload.APNS);
  // then have to stringify the entire message payload
  payload = JSON.stringify(payload);

  sns.publish({
    Message: payload,
    MessageStructure: 'json',
    TargetArn: config.aws.bookingUpdateOrCreateArn,
  }, (err, data) => {
    if (err) {
      console.log(err.stack);
      res.send(err);
      return;
    }
    res.send(data);
  });
});

module.exports = router;
