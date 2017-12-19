process.env.NODE_ENV = 'test';

const app = require('../app/server/index.js');
const knex = require('../app/database/knex');
const request = require('supertest');
const chai = require('chai');

const { expect } = chai;


beforeEach((done) => {
  knex.migrate.rollback()
    .then(() => {
      knex.migrate.latest()
        .then(() => {
          return knex.seed.run()
            .then(() => {
              done();
            });
        });
    });
});

afterEach((done) => {
  knex.migrate.rollback()
    .then(() => {
      done();
    });
});

describe('Server', () => {
  describe('GET /bookings/:list_id', () => {
    it('should return 200 status', (done) => {
      request(app)
        .get('/bookings/1')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.length(8);
          done();
        });
    });
  });

  describe('POST /bookings/:list_id', () => {
    it('should post a booking', (done) => {
      request(app)
        .post('/bookings')
        .send({
          listingId: '2',
          userId: '24',
          startDate: '2017-01-06',
          endDate: '2017-01-09',
        })
        .end((err, res) => {
          request(app)
            .get('/bookings/2')
            .expect(200)
            .end((err, res) => {
              expect(res.body).to.have.length(4);
              done();
            });
        });
    });

    it('should error if listing is already booked', (done) => {
      request(app)
        .post('/bookings')
        .send({
          listingId: '1',
          userId: '34',
          startDate: '2017-01-02',
          endDate: '2017-01-06',
        })
        .expect(409)
        .end(done);
    });

    it('should error if listing has blackout dates', (done) => {
      request(app)
        .post('/bookings')
        .send({
          listingId: '1',
          userId: '76',
          startDate: '2017-01-10',
          endDate: '2017-01-15',
        })
        .expect(409)
        .end(done);
    });
  });
});
