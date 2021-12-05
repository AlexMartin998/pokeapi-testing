'use strict';

const router = require('express').Router();
const { response, request } = require('express');
const passport = require('passport');
const axios = require('axios');

const Team = require('./../models/team.model.js');

// Consult Team
router
  .route('/')
  .put(
    passport.authenticate('jwt', { session: false }),
    async (req = request, res = response) => {
      // TODO: PUT haga la consulta con Axios
      const { team } = req.body;
      if (!team) return res.status(400).json({ msg: 'Team is require!' });

      const userID = req.user._id;

      // Xq solo va a haver 1 team para c/user
      await Team.updateOne(
        { user: userID },
        {
          pokemon: team,
          user: req.user._id,
        },
        { upsert: true } // si no existe lo crea
      );

      const pokemonArr = await Team.findOne({ user: userID });

      return res.status(200).json({ msg: 'Hello Wolrd!', pokemonArr });
    }
  )
  .get(
    passport.authenticate('jwt', { session: false }),
    async (req = request, res = response) => {
      // req.user   solo si uso passport antes (middleware)
      // console.log('>>> PASSPORT: ', req.user);

      // TODO: ??? Xq ya solo me retorna los del user (tema vinculado al UserID de mongodb) -  En donde sea necesario, verificar este  req.user._id  con el team.user pasa saber si es el mismo user. Asi protejo q otro No pueda hacer algo con los de otro user.
      const user = req.user._id.toString();
      const team = await Team.findOne({ user });

      res.status(200).json({
        trainer: req.user.name,
        team: team?.pokemon || [],
      });
    }
  );

// // Add Pokemon
router
  .route('/pokemons')
  .post(
    passport.authenticate('jwt', { session: false }),
    async (req = request, res = response) => {
      // TODO: Reciba Arr de pokemons y los almacener en DB
      const userID = req.user._id;
      const { name } = req.body;

      try {
        const { data } = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
        );

        const pokeData = {
          pokemon: {
            name: data.name,
            pokedexNumber: data.id,
          },
          user: userID,
        };

        const team = Team(pokeData);
        const teamComplete = await team.save();

        res
          .status(200)
          .json({ msg: 'POST - Pokemon', team: teamComplete.pokemon });
      } catch (error) {
        return res.status(400).json({ msg: error });
      }
    }
  );

router
  .route('/pokemons/:id')
  .delete(
    passport.authenticate('jwt', { session: false }),
    async (req = request, res = response) => {
      const { id } = req.params;
      const user = req.user;

      const { pokemon: team } = await Team.findOne({ user });
      team.splice(id - 1, 1);

      await Team.updateOne(
        { user },
        {
          pokemon: team,
        }
      );

      res.status(200).json({ msg: 'Deleted!', team });
    }
  );

module.exports = router;
