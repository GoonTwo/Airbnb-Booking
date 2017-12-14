/* eslint-disable */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app/server/index.js');
const knexCleaner = require('knex-cleaner');
const config = require('../knexfile');
const knex = require('../app/database/knex');

const should = chai.should();
chai.use(chaiHttp);

before(function () {
  // runs before all tests in this block
});

after(function () {
  // runs after all tests in this block
});

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
  describe('GET /booking/:list_id', function () {

    it('should return 200 status', function (done) {
      chai.request(server)
        .get('/')
        .end(function (err, res) {
          res.should.have.status(200);
          done();
        });
    });

    it('should return listings for list_id 1', function (done) {
      chai.request(server)
        .get('/booking/1')
        .end(function (err, res) {
          res.body[1].should.have.length(3);
          done();
        });
    });
  });

  describe('POST /booking/:list_id', function () {

    it('should post a booking', function (done) {
      chai.request(server)
        .post('/booking/3')
        .send({
          "guest_id": "24",
          "startDate": "1/01/17",
          "endDate": "1/01/17"
        })
        .end(function (err, res) {
          res.should.have.status(200);
          done();
        });
    });

    it('should error if listing is already booked', function (done) {
      chai.request(server)
        .post('/booking/3')
        .send({
          "guest_id": "24",
          "startDate": "1/01/17",
          "endDate": "1/01/17"
        })
        .end(function (err, res) {
          res.should.have.status(200);
          done();
        });
    });
    
  });
});