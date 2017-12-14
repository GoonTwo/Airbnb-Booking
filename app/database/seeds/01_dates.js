/* eslint-disable */
const datesBetween = require('dates-between');
const moment = require('moment');

const startDate = new Date('2017-01-01');
const endDate = new Date('2017-12-31');
const dates = [];

for (const date of datesBetween(startDate, endDate)) {
  let newdate = moment(date).format('L');
  dates.push({
    date: newdate
  });
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('dates').del()
    .then(function () {
      // Inserts seed entries
      return knex('dates').insert(dates);
    });
};
