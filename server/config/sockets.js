// config/socket.js
var sockets = [];

exports.add = function (socket) {
  sockets.push(socket);
};

exports.getAll = function () {
  return sockets;
};

exports.broadcast = function(event, data) {
  console.log ('Socket Emit for event ' + event);
  //console.log (data);
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
};

exports.socketObject = function(data) {
  return data;
};
