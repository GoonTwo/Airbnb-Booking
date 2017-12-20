const express = require('express');
const AWS = require('aws-sdk');
const makeBooking = require('./middleware/makeBooking');

AWS.config.update({ region: 'us-east-2' });
const sns = new AWS.SNS();

const router = express.Router();
const requestArn = 'arn:aws:sns:us-east-2:886843335123:availability-request';

router.post('/bookings', (req, res) => {
  makeBooking(req, res);
});

router.get('/send', (req, res) => {
  const body = {
    listingId: 123,
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
    TargetArn: requestArn,
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
