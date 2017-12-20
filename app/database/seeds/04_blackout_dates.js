exports.seed = (knex, Promise) => {
  return knex('blackout_dates').del()
    .then(() => {
      return knex('blackout_dates').insert([
        { listing_id: 1, date: '2017-01-10' },
        { listing_id: 1, date: '2017-01-11' },
        { listing_id: 1, date: '2017-01-12' },
      ]);
    });
};
