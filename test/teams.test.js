'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./../app.js');

chai.use(chaiHttp);

describe('[ TEAMS ]: Suite de pruebas Team', () => {
  it('1. should return the team of the given user', done => {
    const team = [
      { name: 'Charizard' },
      { name: 'Blastoise' },
      { name: 'Pickachu' },
    ];

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
        // // Expect valid login:
        const token = res.body.token;
        // console.log('>>>>> RESPONSE LOGIN:  ', { token });
        chai.assert.equal(res.status, 200);

        chai
          .request(app)
          .put('/teams')
          .send({
            team,
          })
          .set('Authorization', `${token}`)
          .end((err, res) => {
            chai
              .request(app)
              .get('/teams')
              .set('Authorization', `${token}`)
              .end((err, res) => {
                // // Tiene equipo con Charizad y Blastoise
                // {trainer: 'Alex 1', team: [Pokemon]}
                chai.assert.equal(res.status, 200);
                chai.assert.equal(res.body.trainer, 'Alex 1'); // Usuario logueado
                chai.assert.equal(res.body.team.length, team.length);
                chai.assert.equal(res.body.team[0].name, team[0].name);
                chai.assert.equal(res.body.team[1].name, team[1].name);

                done();
              });
          });
      });
  });

  it('2. should return the pokedex number', done => {
    const pokemonName = 'bulbasaur';

    chai
      .request(app)
      .post('/auth/login')
      .set('content-type', 'application/json')
      .send({
        email: 'test2@test.com',
        password: '123123',
      })
      .end((err, res) => {
        // // Expect valid login:
        const token = res.body.token;
        // console.log('>>>>> RESPONSE LOGIN:  ', { token });
        chai.assert.equal(res.status, 200);

        chai
          .request(app)
          .post('/teams/pokemons')
          .send({
            name: pokemonName,
          })
          .set('Authorization', `${token}`)
          .end((err, res) => {
            chai
              .request(app)
              .get('/teams')
              .set('Authorization', `${token}`)
              .end((err, res) => {
                // // Tiene equipo con Charizad y Blastoise
                // {trainer: 'Alex 1', team: [Pokemon]}
                chai.assert.equal(res.status, 200);
                chai.assert.equal(res.body.trainer, 'Alex 2'); // Usuario logueado
                chai.assert.equal(res.body.team.length, 1);
                chai.assert.equal(res.body.team[0].name, pokemonName);
                chai.assert.equal(res.body.team[0].pokedexNumber, 1);

                done();
              });
          });
      });
  });
});
