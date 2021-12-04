'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./../app.js');

chai.use(chaiHttp);

describe('[ AUTH ]: Suite de pruebas Auth', () => {
  it('1. should return 401 when no jwt token available', done => {
    // Cuando la llamada No tiene una llave valida
    chai
      .request(app)
      .get('/teams')
      .end((err, res) => {
        chai.assert.equal(res.status, 401);
        done();
      });
  });
  it('2. should return 400 when no data is provided', done => {
    chai
      .request(app)
      .post('/auth/login')
      .end((err, res) => {
        // Expect valid login
        chai.assert.equal(res.status, 400);
        done();
      });
  });
  it('3. should return 200 and token for succesful login', done => {
    chai
      .request(app)
      .post('/auth/login')
      .set('content-type', 'application/json')
      .send({
        email: 'test1@test.com',
        password: '123123',
      })
      .end((err, res) => {
        // Expect valid login
        chai.assert.equal(res.status, 200);
        done();
      });
  });
  it('4. should return 200 when jwt is valid', done => {
    chai
      .request(app)
      .post('/auth/login')
      .set('content-type', 'application/json')
      .send({
        email: 'test1@test.com',
        password: '123123',
      })
      .end((err, res) => {
        // console.log('>>>>> RESPONSE LOGIN:  ', res.body.token);

        // Expect valid login
        chai.assert.equal(res.status, 200);
        chai
          .request(app)
          .get('/teams')
          .set('Authorization', `${res.body.token}`)
          .end((err, res) => {
            chai.assert.equal(res.status, 200);
            done();
          });
      });
  });
});
