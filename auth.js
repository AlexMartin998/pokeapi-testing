'use strict';

const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;

const { SECRETORPRIVATEKEY } = require('./config');
const User = require('./models/user.model.js');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRETORPRIVATEKEY,
};

module.exports = new JwtStrategy(opts, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    if (!user) return done(null, false);

    // Lo q mande aqui como 2do parametro sera el value de    req.user
    return done(null, user);
  } catch (error) {
    console.log(error);
  }
});
