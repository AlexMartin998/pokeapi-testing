'use strict';

const User = require('./../models/user.model.js');

const registerUser = async (email, password) => {
  const user = await User({ email, password });
  await user.save();
};

const checkUserCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  return user.comparePassword(password);
};

module.exports = {
  registerUser,
  checkUserCredentials,
};
