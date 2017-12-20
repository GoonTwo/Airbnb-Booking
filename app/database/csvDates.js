const fs = require('fs');
const moment = require('moment');

const startDate = new Date('2017-01-01');
const endDate = new Date('2018-01-01');

const dates = [];

function randomBeginDate() {
  const date = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
  return date;
}

function randomEndDate(bookingStart) {
  const result = new Date(bookingStart);
  result.setDate(result.getDate() + (Math.floor(Math.random() * 3) + 1));
  return result;
}

for (let i = 0; i < 1000; i += 1) {
  const bookingStart = randomBeginDate();
  const bookingEnd = randomEndDate(bookingStart);
  dates.push(`${moment(bookingStart).format('YYYY-MM-DD')}, ${moment(bookingEnd).format('YYYY-MM-DD')}`);
}

fs.writeFile('/Users/dannywelstad/Desktop/tools/apache-jmeter-3.3/dates.txt', dates.join('\n'), 'utf8', (err, res) => {
  console.log(err);
});
