'use strict';

const router = require('express').Router();

const {
  addPokemonToTeam,
  updateTeam,
  getTeam,
  deletePokemon,
} = require('./teams.http.js');

// Consult / Update-set Team
router.route('/').put(updateTeam).get(getTeam);

// Add Pokemon
router.route('/pokemons').post(addPokemonToTeam);

// Delete Pokemon
router.route('/pokemons/:id').delete(deletePokemon);

module.exports = router;
