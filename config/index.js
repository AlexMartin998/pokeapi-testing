'use strict';

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

module.exports = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  SECRETORPRIVATEKEY: process.env.SECRETORPRIVATEKEY,
};
