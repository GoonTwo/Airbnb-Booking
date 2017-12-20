const AWS = require('aws-sdk');
const Consumer = require('sqs-consumer');
const config = require('../../config');

AWS.config.update({ region: 'us-east-2' });
const sqs = new AWS.SQS();
const getBookings = require('../middleware/getBookings');

const availabilityRequest = Consumer.create({
  queueUrl: config.aws.requestQueue,
  handleMessage: (message, done) => {
    const load = JSON.parse(message.Body).Message;
    const { listingId } = JSON.parse(load);
    getBookings(listingId)
      .then((availability) => {
        const params = {
          MessageBody: JSON.stringify(availability),
          QueueUrl: config.aws.responseQueue,
          DelaySeconds: 0,
        };
        sqs.sendMessage(params, (err, data) => {
          if (err) {
            console.log(err);
          }
          done();
        });
      });
  },
  sqs: new AWS.SQS(),
});

availabilityRequest.on('error', (err) => {
  console.log(err.message);
});

module.exports = availabilityRequest;
