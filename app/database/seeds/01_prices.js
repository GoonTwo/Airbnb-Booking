exports.seed = (knex, Promise) => {
  return knex('prices').del()
    .then(() => {
      return knex('prices').insert([
        { listing_id: 1, price: '50.00' },
        { listing_id: 2, price: '30.00' },
      ]);
    });
};
