'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('./../app.js');

chai.use(chaiHttp);

/* describe('Suit de pruea e2e (end to end/integration)', () => {
  it('should return a json', done => {
    chai
      .request(serverModel.app)
      .get('/team')
      .end((err, res) => {
        chai.assert.equal(
          res.type,
          'application/json'
        );
        done();
      });
  });
});
 */
