var express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  config = require('./config/db'),
  path = require('path'),
  PORT = process.env.PORT || 8000;

  var options = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }

// mongoose instance connection url connection
if (mongoose.connection.readyState != 1) {
  mongoose.Promise = global.Promise;
  console.log("DB URL ",config.db);
  mongoose.connect(config.db, options);
  const db = mongoose.connection;
  db.on('error', err => {
    throw new Error(`Unable to connect to database at ${config.db} err`);
  });

  db.once('open', function() {
    console.log('Database is connected');
  });
}

// Bring in our dependencies
require('./config/express')(app, config);

app.listen(PORT, () => {
  console.log('We are live on port: ', PORT);
});
