'use strict';

const router = require('express').Router();
const { response, request } = require('express');
const passport = require('passport');

const Team = require('./../models/team.model.js');

// Add Pokemon
router.route('/pokemons').post((req = request, res = response) => {
  res.status(200).json({ msg: 'Pokemon added!' });
});

// Consult Team
router
  .route('/')
  .put(
    passport.authenticate('jwt', { session: false }),
    async (req = request, res = response) => {
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

      // TODO: En donde sea necesario, verificar este  req.user._id  con el team.user pasa saber si es el mismo user. Asi protejo q otro No pueda hacer algo con los de otro user.
      const user = req.user._id.toString();
      const team = await Team.findOne({ user });

      res.status(200).json({ trainer: req.user.name, team: team.pokemon });
    }
  );

// Delete Pokemon
router.route('/pokemons').post((req = request, res = response) => {
  res.status(200).json({ msg: 'POST - Pokemon' });
});

router.route('/pokemons/:id').delete((req = request, res = response) => {
  res.status(200).json({ msg: 'Deleted!' });
});

module.exports = router;
