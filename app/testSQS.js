const AWS = require('aws-sdk');
const config = require('./config');

AWS.config.update({ region: 'us-east-2' });
const sns = new AWS.SNS();

for (let i = 0; i < 10000; i += 1) {
  const body = {
    listingId: Math.floor(Math.random() * 100000),
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
      return;
    }
  });

}