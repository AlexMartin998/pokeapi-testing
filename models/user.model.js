const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

// Hook
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // ? no entiendo :v

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
});

UserSchema.methods.comparePassword = async function (password) {
  // TODO: Registrar users in db
  // return await bcrypt.compare(password, this.passwor);
  return password === this.password;
};

module.exports = model('User', UserSchema);
