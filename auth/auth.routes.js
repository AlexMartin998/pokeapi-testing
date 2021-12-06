'use strict';

const router = require('express').Router();

const { LogIn, addUser, testPrivate, helloWorld } = require('./auth.hhtp.js');

router.route('/').get(helloWorld);

// Register User <--  Bettatech, esto, lo maneja con f(x), NO con rutes
router.route('/join').post(addUser);

// Login
router.route('/login').post(LogIn);

// Test passport strategy
router.route('/private').post(testPrivate);

module.exports = router;
