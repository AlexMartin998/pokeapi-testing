'use strict';

const { Schema, model } = require('mongoose');

const TeamSchema = Schema(
  {
    pokemon: {
      type: Array,
      default: [],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Team', TeamSchema);
