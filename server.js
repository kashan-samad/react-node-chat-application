var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');

var app = express();
var server = http.createServer(app);

var db = require('./server/config/db');

var port = process.env.PORT || 8000;
var db_url = 'mongodb://localhost:27017/chatApp';

// Application Settings
app.set('port', port);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Auth');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    next();
});

app.use(express.static(path.resolve(__dirname, 'client')));

// Connect with DB
db.connect(db_url, function (err) {
  // DB Error
  if (err) {
    console.log('Unable to Connect DB');
    process.exit(1);
  }

  app.listen(port, function() {
    require('./server/routes')(app);
    console.log('LISTENING TO PORT ' + port);
  });
});
