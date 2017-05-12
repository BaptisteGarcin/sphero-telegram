//require modules
const express = require('express');

//create web server
const app = express();

// Bootstrap application settings
require('./service/express')(app);

// Bootstrap routes
require('./service/routes')(app);


const server = app.listen(8010, function() {
  const host = server.address().address;
  const port = server.address().port;
  console.log("Sphero Wit service listening at http://%s:%s", host, port)
});

module.exports = app;
