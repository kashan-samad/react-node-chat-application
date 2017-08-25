var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

var db = require('./server/config/db');
var sockets = require('./server/config/sockets');

var port = process.env.PORT || 8000;
var db_url = 'mongodb://localhost:27017/chatApp';

//var messages = [];
//var sockets = [];

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

/*
io.on('connection', function (socket) {
    messages.forEach(function (data) {
      socket.emit('message', data);
    });

    sockets.push(socket);

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
      updateRoster();
    });

    socket.on('message', function (msg) {
      var text = String(msg || '');

      if (!text)
        return;

      socket.get('name', function (err, name) {
        var data = {
          name: name,
          text: text
        };

        broadcast('message', data);
        messages.push(data);
      });
    });

    socket.on('identify', function (name) {
      socket.set('name', String(name || 'Anonymous'), function (err) {
        updateRoster();
      });
    });
  });

function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('name', callback);
    },
    function (err, names) {
      broadcast('roster', names);
    }
  );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}
*/

// Connect with DB
db.connect(db_url, function (err) {
  // DB Error
  if (err) {
    console.log('Unable to Connect DB');
    process.exit(1);
  }

  // Socket Connection
  io.on('connection', function (socket) {
    sockets.add(socket);
    console.log ('New Socket:' + socket.id);
    // Define Socket Event
    socket.on('message', function (obj) {
      sockets.broadcast('message', obj);
    });
  });

  server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
    var addr = server.address();
    console.log("Chat server listening at", addr.address + ":" + addr.port);
  });

  app.listen(port, function() {
    require('./server/routes')(app);
    console.log('LISTENING TO PORT ' + port);
  });
});
