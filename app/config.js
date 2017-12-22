module.exports = {
  aws: {
    requestQueue: 'https://sqs.us-east-2.amazonaws.com/886843335123/availability-request',
    responseQueue: 'https://sqs.us-east-2.amazonaws.com/886843335123/availability-response',
    updateBookingQueue: 'https://sqs.us-east-2.amazonaws.com/886843335123/update-booking',
    requestArn: 'arn:aws:sns:us-east-2:886843335123:availability-request',
    responseArn: 'arn:aws:sns:us-east-2:886843335123:availability-response',
    bookingUpdateOrCreateArn: 'arn:aws:sns:us-east-2:886843335123:bookings-update-or-create',
  },
};
