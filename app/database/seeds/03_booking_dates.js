exports.seed = (knex, Promise) => {
  return knex('booking_dates').del()
    .then(() => {
      return knex('booking_dates').insert([
        { listing_id: 1, date: '2017-01-01' },
        { listing_id: 1, date: '2017-01-02' },
        { listing_id: 1, date: '2017-01-03' },
        { listing_id: 1, date: '2017-01-04' },
        { listing_id: 1, date: '2017-01-05' },
      ]);
    });
};
