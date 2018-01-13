const AWS = require('aws-sdk');
const Consumer = require('sqs-consumer');
const config = require('../../config');

AWS.config.update({ region: 'us-east-2' });
const sns = new AWS.SNS();
const getBookings = require('../middleware/getBookings');

const availabilityConsumer = Consumer.create({
  queueUrl: config.aws.requestQueue,
  batchSize: 10,
  handleMessage: (message, done) => {
    const load = JSON.parse(message.Body).Message;
    const { listingId } = JSON.parse(load);
    getBookings(listingId)
      .then((availability) => {
        let payload = {
          default: JSON.stringify(availability),
          APNS: {
            aps: {
              alert: JSON.stringify(availability),
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
          TargetArn: config.aws.responseArn,
        }, (err, data) => {
          if (err) {
            throw new Error(err);
          } else {
            console.log(data);
            done();
          }
        });
      });
  },
  sqs: new AWS.SQS(),
});

availabilityConsumer.on('error', (err) => {
  console.log(err.message);
});

module.exports = availabilityConsumer;
