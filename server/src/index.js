const mongoose = require('mongoose');
const app = require('./app');
const { mongoUri, port } = require('./config');

mongoose.connect(mongoUri)
  .then(() => app.listen(port, () => console.log(`TeleMed API listening on ${port}`)))
  .catch((error) => { console.error('MongoDB connection failed', error); process.exit(1); });
