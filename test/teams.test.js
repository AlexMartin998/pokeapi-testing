'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { cleanUpTeams } = require('../controllers/teams.controller.js');
const app = require('./../app.js');

chai.use(chaiHttp);

afterEach(done => {
  cleanUpTeams();
  done();
});

// Tengo acceso al  test3@test.com  xq aun no elimina el  after del auth
describe('[ TEAMS ]: Suite de pruebas Team', () => {
  const user = {
    name: 'Alex 3',
    email: 'test3@test.com',
    password: '123123',
  };

  it('1. should return the team of the given user', done => {
    const team = [{ name: 'bulbasaur', pokedexNumber: 1 }];

    // Solo puede consultar sus teams, el de nadie mas.
    chai
      .request(app)
      .post('/auth/login')
      .set('content-type', 'application/json')
      .send(user)
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
                chai.assert.equal(res.status, 200);
                chai.assert.equal(res.body.trainer, user.name); // Usuario logueado
                chai.assert.equal(res.body.team.length, team.length);
                chai.assert.equal(res.body.team[0].name, team[0].name);
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
      .send(user)
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
                chai.assert.equal(res.body.trainer, user.name); // Usuario logueado
                chai.assert.equal(res.body.team.length, 1);
                chai.assert.equal(res.body.team[0].name, pokemonName);
                chai.assert.equal(res.body.team[0].pokedexNumber, 1);

                done();
              });
          });
      });
  });

  it('3. should remove the pokemon at index', done => {
    const team = [
      { name: 'bulbasaur', pokedexNumber: 1 },
      { name: 'charmander', pokedexNumber: 2 },
      { name: 'blastoise', pokedexNumber: 3 },
    ];
    const initialLength = team.length;

    chai
      .request(app)
      .post('/auth/login')
      .set('content-type', 'application/json')
      .send(user)
      .end((err, res) => {
        // // Expect valid login:
        const token = res.body.token;
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
                chai.assert.equal(res.body.trainer, user.name); // Usuario logueado
                chai.assert.equal(res.body.team.length, initialLength);

                // // Eliminar el pokemon 2 (index = 1)
                chai
                  .request(app)
                  .delete('/teams/pokemons/2')
                  .set('Authorization', `${token}`)
                  .end((err, res) => {
                    chai.assert.equal(res.body.team.length, initialLength - 1);
                    chai.assert.equal(res.status, 200);
                    done();
                  });
              });
          });
      });
  });
});
