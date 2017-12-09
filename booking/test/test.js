var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app/server/index.js');
var should = chai.should();
chai.use(chaiHttp);

describe('Server', function () {
  describe('/Get', function () {
    it('should return 200 status', function (done) {
      chai.request(server)
        .get('/')
        .end(function (err, res) {
          res.should.have.status(200);
          done();
        });
    });
  });
});