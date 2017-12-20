/* eslint-disable */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app/server/index.js');
const config = require('../knexfile');
const knex = require('../app/database/knex');

const should = chai.should();
chai.use(chaiHttp);

beforeEach(function (done) {
  knex.migrate.rollback()
    .then(function () {
      knex.migrate.latest()
        .then(function () {
          return knex.seed.run()
            .then(function () {
              done();
            });
        });
    });
});

afterEach(function (done) {
  knex.migrate.rollback()
    .then(function () {
      done();
    });
});


describe('Server', function () {
  describe('GET /bookings/:list_id', function () {

    it('should return 200 status', function (done) {
      chai.request(server)
        .get('/bookings/1')
        .end(function (err, res) {
          res.should.have.status(200);
          done();
        });
    });

    it('should return all booked dates', function (done) {
      chai.request(server)
        .get('/bookings/1')
        .end(function (err, res) {
          res.body.should.have.length(8);
          done();
        });
    });
  });

  describe('POST /bookings/:list_id', function () {

    it('should post a booking', function (done) {
      chai.request(server)
        .post('/bookings')
        .send({
          listingId: '2',
          userId: '24',
          startDate: '2017-01-06',
          endDate: '2017-01-09',
        })
        .end((err, res) => {
          res.should.have.status(200);
          chai.request(server)
            .get('/bookings/2')
            .end(function (err, res) {
              res.body.should.have.length(4);
              done();
            });
        });
    });

    it('should error if listing is already booked', function (done) {
      chai.request(server)
        .post('/bookings')
        .send({
          listingId: '1',
          userId: '34',
          startDate: '2017-01-02',
          endDate: '2017-01-06',
        })
        .end(function (err, res) {
          res.should.have.status(409);
          done();
        })
    });

    it('should error if listing has blackout dates', function (done) {
      chai.request(server)
        .post('/bookings')
        .send({
          listingId: '1',
          userId: '76',
          startDate: '2017-01-10',
          endDate: '2017-01-15',
        })
        .end(function (err, res) {
          res.should.have.status(409);
          done();
        })
    });

  });
});