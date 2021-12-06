'use strict';

const Team = require('./team.model.js');

const cleanUpTeams = async () => {
  await Team.deleteMany({});
};





module.exports = {
  cleanUpTeams,
};
