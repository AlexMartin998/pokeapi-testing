'use strict';

const Team = require('./../models/team.model.js');

const cleanUpTeams = async () => {
  await Team.deleteMany({});
};

module.exports = {
  cleanUpTeams,
};
