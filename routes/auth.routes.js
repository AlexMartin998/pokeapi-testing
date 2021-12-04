'use strict';

const router = require('express').Router();
const { response, request } = require('express');

const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('./../models/user.model.js');
const { checkUserCredentials } = require('../controllers');
const { SECRETORPRIVATEKEY } = require('../config');

function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, SECRETORPRIVATEKEY, {
    expiresIn: '24h',
  });
}

router.route('/').get((req, res) => {
  res.status(200).send('HW');
});

// Login
router.route('/login').post(async (req = request, res = response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: 'Email and Password are required!' });

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ msg: `The user '${email}'' doesn't exist!` });

  const isMatch = await checkUserCredentials(email, password);
  if (!isMatch) return res.status(401).json({ msg: 'Incorrect password!' });

  const token = `Bearer ${createToken(user)}`;

  res.status(200).json({ msg: 'Ok!', token });
});

// Test passport strategy
router
  .route('/private')
  .post(
    passport.authenticate('jwt', { session: false }),
    async (req = request, res = response) => {
      const { email, password } = req.body;
      if (!email || !password)
        return res
          .status(400)
          .json({ msg: 'Email and Password are required!' });

      const user = await User.findOne({ email });
      if (!user)
        return res
          .status(404)
          .json({ msg: `The user '${email}'' doesn't exist!` });

      res.status(200).json({ msg: 'Ok!', email, password });
    }
  );

module.exports = router;
