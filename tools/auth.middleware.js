'use strict';

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;

const { SECRETORPRIVATEKEY } = require('../config');
const User = require('../auth/user.model.js');

const initializePassport = () => passport.initialize();

const init = () => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: SECRETORPRIVATEKEY,
  };

  passport.use(
    new JwtStrategy(opts, async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
        if (!user) return done(null, false);

        // Lo q mande aqui como 2do parametro sera el value de    req.user
        return done(null, user);
      } catch (error) {
        console.log(error);
      }
    })
  );
};

const protectWithJWT = (req, res, next) => {
  if (
    req.path === '/' ||
    req.path === '/auth/join' ||
    req.path === '/auth/login'
  )
    return next();

  return passport.authenticate('jwt', { session: false })(req, res, next);
};

module.exports = {
  initializePassport,
  init,
  protectWithJWT,
};
