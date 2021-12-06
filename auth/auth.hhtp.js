'use strict';

const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const User = require('./user.model.js');
const { checkUserCredentials } = require('./users.controller.js');
const { SECRETORPRIVATEKEY } = require('../config/index.js');

function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, SECRETORPRIVATEKEY, {
    expiresIn: '24h',
  });
}

const addUser = async (req = request, res = response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ msg: 'Check your email and password!' });

  const user = await User.findOne({ email });
  if (user) return res.status(400).json({ msg: 'Email already registered!' });

  const newUser = User({ name, email, password });
  await newUser.save();

  res.status(201).json({ msg: 'Registered!', newUser });
};

const LogIn = async (req = request, res = response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: 'Email and Password are required!' });

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ msg: `The user '${email}'' doesn't exist!` });

  const isMatch = await checkUserCredentials(user, password);
  if (!isMatch) return res.status(401).json({ msg: 'Incorrect password!' });

  const token = `Bearer ${createToken(user)}`;

  return res.status(200).json({ msg: 'Ok!', token });
};

const testPrivate = async (req = request, res = response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: 'Email and Password are required!' });

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ msg: `The user '${email}'' doesn't exist!` });

  res.status(200).json({ msg: 'Ok!', email, password });
};

const helloWorld = (req, res) => {
  res.status(200).send('Hello World!');
};

module.exports = {
  addUser,
  LogIn,
  testPrivate,
	helloWorld
};
