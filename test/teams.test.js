'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./../app.js');

chai.use(chaiHttp);

describe('[ TEAMS ]: Suite de pruebas Team', () => {
  it('1. should return the team of the given user', done => {
    // Solo puede consultar sus teams, el de nadie mas.
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
            // Tiene equipo con Charizad y Blastoise
            // {trainer: 'Alex 1', team: [Pokemon]}
            chai.assert.equal(res.status, 200);
            chai.assert.equal(res.body.trainer, 'Alex 1'); // Usuario logueado
            chai.assert.equal(res.body.team.length, 2);
            chai.assert.equal(res.body.team[0], 'Charizad');
            chai.assert.equal(res.body.team[1], 'Blastoise');

            done();
          });
      });
  });
});
