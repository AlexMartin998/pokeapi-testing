'use strict';

const express = require('express');
const {
  init: authInit,
  initializePassport,
  protectWithJWT,
} = require('../tools/auth.middleware');

const setupMiddlewares = app => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Passport:
  app.use(initializePassport());
  authInit();
  app.use(protectWithJWT);
};

module.exports = {
  setupMiddlewares,
};
