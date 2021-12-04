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
  .get(
    passport.authenticate('jwt', { session: false }),
    async (req = request, res = response) => {
      // req.user   solo si uso passport antes (middleware)
      // console.log('>>> PASSPORT: ', req.user);

      const user = req.user._id.toString();
      const team = await Team.findOne({ user });

      // const team = ['Charizad', 'Blastoise'];
      res.status(200).json({ trainer: req.user.name, team: team.pokemon });
    }
  )
  .put((req = request, res = response) => {
    res.status(200).json({ msg: 'Hello Wolrd!' });
  });

// Delete Pokemon
router.route('/pokemons').post((req = request, res = response) => {
  res.status(200).json({ msg: 'POST - Pokemon' });
});

router.route('/pokemons/:id').delete((req = request, res = response) => {
  res.status(200).json({ msg: 'Deleted!' });
});

module.exports = router;
