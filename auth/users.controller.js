'use strict';

const User = require('./user.model.js');

const registerUser = async (email, password) => {
  const user = await User({ email, password });
  await user.save();
};

const checkUserCredentials = async (user, password) =>
  user.comparePassword(password);

const cleanUpUser = async () => {
  await User.deleteMany({});
};

module.exports = {
  registerUser,
  checkUserCredentials,
  cleanUpUser
};
