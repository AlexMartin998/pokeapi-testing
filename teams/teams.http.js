'use strict';

const { response, request } = require('express');
const axios = require('axios');

const Team = require('./team.model.js');
const to = require('../tools/to.js');

const getTeam = async (req = request, res = response) => {
  // req.user   solo si uso passport antes (middleware)
  // console.log('>>> PASSPORT: ', req.user);

  // TODO: ??? Xq ya solo me retorna los del user (tema vinculado al UserID de mongodb) -  En donde sea necesario, verificar este  req.user._id  con el team.user pasa saber si es el mismo user. Asi protejo q otro No pueda hacer algo con los de otro user.
  const user = req.user._id.toString();
  const team = await Team.findOne({ user });

  res.status(200).json({
    trainer: req.user.name,
    team: team?.pokemon || [],
  });
};

const updateTeam = async (req = request, res = response) => {
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
};

const addPokemonToTeam = async (req = request, res = response) => {
  // TODO: Reciba Arr de pokemons y los almacener en DB
  const userID = req.user._id;
  const { name } = req.body;

  const [pokeApiErr, response] = await to(
    axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
  );

  if (pokeApiErr) return res.status(400).json({ msg: pokeApiErr });

  const { data } = response;
  const pokeData = {
    pokemon: {
      name: data.name,
      pokedexNumber: data.id,
    },
    user: userID,
  };

  const team = Team(pokeData);
  const [addErr, teamComplete] = await to(team.save());
  if (addErr) return res.status(400).json({ msg: saveErr });

  res.status(201).json({ msg: 'POST - Pokemon', team: teamComplete.pokemon });
};

const deletePokemon = async (req = request, res = response) => {
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
};

module.exports = {
  getTeam,
  updateTeam,
  addPokemonToTeam,
  deletePokemon,
};
