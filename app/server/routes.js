const express = require('express');
const AWS = require('aws-sdk');
const makeBooking = require('./middleware/makeBooking');
const config = require('../config');

AWS.config.update({ region: 'us-east-2' });
const sns = new AWS.SNS();

const router = express.Router();

router.post('/bookings', (req, res) => {
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
