const AWS = require('aws-sdk');
const Consumer = require('sqs-consumer');
const config = require('../../config');

AWS.config.update({ region: 'us-east-2' });
const handlePayload = require('../middleware/handlePayload');

const updateConsumer = Consumer.create({
  queueUrl: config.aws.updateBookingQueue,
  handleMessage: (message, done) => {
    const payload = JSON.parse(JSON.parse(message.Body).Message);
    handlePayload(payload)
      .then(() => {
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  },
  sqs: new AWS.SQS(),
});

updateConsumer.on('error', (err) => {
  console.log(err.message);
});

module.exports = updateConsumer;
