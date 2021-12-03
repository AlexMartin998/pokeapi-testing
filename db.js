const { connect } = require('mongoose');
const { MONGODB_URI } = require('./config');

(async () => {
  try {
    const db = await connect(MONGODB_URI);
    console.log('DB connected to', db.connection.name);
  } catch (err) {
    console.log(err);
  }
})();
