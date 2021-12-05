'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { cleanUpUser } = require('../controllers/users.controller.js');
const app = require('./../app.js');

chai.use(chaiHttp);

describe('[ AUTH ]: Suite de pruebas Auth', () => {
  const newUser = {
    name: 'Alex 3',
    email: 'test3@test.com',
    password: '123123',
  };

  it('0. should return 200 when registering a New User', done => {
    // Cuando la llamada No tiene una llave valida
    chai
      .request(app)
      .post('/auth/join')
      .set('content-type', 'application/json')
      .send(newUser)
      .end((err, res) => {
        chai.assert.equal(res.status, 201);
        done();
      });
  });
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
      .send(newUser)
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
      .send(newUser)
      .end((err, res) => {
        // Expect valid login
        // console.log('>>>>> RESPONSE LOGIN:  ', res.body.token, res.status);

        chai.assert.equal(res.status, 200);
        // done();

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

after(done => {
  cleanUpUser();
  console.log('CLEAN USER');
  done();
});
