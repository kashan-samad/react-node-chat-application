var Auth = require('./auth');
var Message = require('../models/message');
var User = require('../models/user');

exports.add = function(req, res, next) {
  // If Response already set, goto next call
  if (res.error || res.data) {
    return next(null, res);
  }
  // Check User
  if (!res.user) {
    // Set Response
    res.error = 403;
    return next(null, res);
  }
  var user = res.user;
  // Get Params
  var record = req.params;
  if (!record._id) {
    // Set Response
    res.error = 401;
    return next(null, res);
  }
  var friendId = record._id;
  var record = req.body;
  if (!record.text) {;// && !(record.friendId || record.groupId)) {
    // Set Response
    res.error = 401;
    return next(null, res);
  }
  if (friendId) {
    // DB Query
    User.findById(friendId, function (err, friend) {
      // Check DB Error
      if (err) {
        // Set Response
        res.error = 407;
        return next(null, res);
      }
      if (!friend) {
        // Set Response
        res.error = 403;
        return next(null, res);
      }
      if (!user.friends) {
        // Set Response
        res.error = 403;
        return next(null, res);
      }
      friendFound = false;
      if (user.friends) {
        user.friends.forEach(function(f) {
          if (f.id.toString() === friend._id.toString()) {//&& f.status.toString() === 'accept') {
            friendFound = true;
          }
        });
      }
      if (!friendFound) {
        // Set Response
        res.error = 403;
        return next(null, res);
      }
      record.createdBy = user._id;
      record.createdAt = (new Date()).valueOf().toString();
      // DB Query
      Message.create(record, function (err, item) {
        // Check DB Error
        if (err) {
          // Set Response
          res.error = 407;
          return next(null, res);
        }
        user.friends.forEach(function(f) {
          if (f.id.toString() === friend._id.toString() && f.status.toString() === 'accept') {
            if (!f.messages) {
              f.messages = [];
            }
            f.messages.push({id: record._id, status: 'new'});
          }
        });
        // DB Query
        User.update(user._id, user, function (err, item) {
          // Check DB Error
          if (err) {
            // Set Response
            res.error = 407;
            return next(null, res);
          }
          friend.friends.forEach(function(f) {
            if (f.id.toString() === user._id.toString() && f.status.toString() === 'accept') {
              if (!f.messages) {
                f.messages = [];
              }
              f.messages.push({id: record._id, status: 'sent'});
            }
          });
          // DB Query
          User.update(friend._id, friend, function (err, item) {
            // Check DB Error
            if (err) {
              // Set Response
              res.error = 407;
              return next(null, res);
            }
            // Set Response
            res.error = false;
            res.data = record;
            return next(null, res);
          });
        });
      });
    });
  }
  /*
  // DB Query
  Message.find(record, function (err, item) {
    // Check DB Error
    if (err) {
      // Set Response
      res.error = 407;
      return next(null, res);
    }
    if (item) {
      // Set Response
      res.error = 403;
      return next(null, res);
    }
    record.createdBy = user._id;
    record.createdAt = (new Date()).valueOf().toString();
    // DB Query
    Message.create(record, function (err, item) {
      // Check DB Error
      if (err) {
        // Set Response
        res.error = 407;
        return next(null, res);
      }
      // Set Response
      res.error = false;
      res.data = record;
      return next(null, res);
    });
  });
  */
};

exports.read = function(req, res, next) {
  // If Response already set, goto next call
  if (res.error || res.data) {
    return next(null, res);
  }
  // Check User
  if (!res.user) {
    // Set Response
    res.error = 403;
    return next(null, res);
  }
  var user = res.user;
  // Get Params
  var record = req.params;
  if (!record._id || !record.friendId) {
    // Set Response
    res.error = 401;
    return next(null, res);
  }
  // DB Query
  Message.findById(record._id, function (err, message) {
    // Check DB Error
    if (err) {
      // Set Response
      res.error = 407;
      return next(null, res);
    }
    if (!message) {
      // Set Response
      res.error = 403;
      return next(null, res);
    }
    messageFound = false;
    if (user.friends) {
      user.friends.forEach(function(f) {
        if (f.id.toString() === record.friendId.toString()) {
          if (f.messages) {
            f.messages.forEach(function(m) {
              if (m.id.toString() === record._id.toString()) {
                messageFound = true;
                m.status = 'read';
              }
            });
          }
        }
      });
    }
    if (messageFound) {
      // DB Query
      User.update(user._id, user, function (err, item) {
        // Check DB Error
        if (err) {
          // Set Response
          res.error = 407;
          return next(null, res);
        }
        // Set Response
        res.error = false;
        res.data = res.user;
        return next(null, res);
      });
    }
  });
};

exports.list = function(req, res, next) {
  // If Response already set, goto next call
  if (res.error || res.data) {
    return next(null, res);
  }
  // Check User
  if (!res.user) {
    // Set Response
    res.error = 403;
    return next(null, res);
  }
  var user = res.user;
  // Get Params
  var record = req.params;
  if (!record._id) {
    // Set Response
    res.error = 401;
    return next(null, res);
  }
  friendFound = false;
  messages = '';
  messagesArray = [];
  if (user.friends) {
    user.friends.forEach(function(f) {
      if (f.id.toString() === record._id.toString() && f.status.toString() === 'accept') {
        friendFound = true;
        messages = f.messages;
      }
    });
  }
  if (friendFound && messages.length > 0) {
    messages.forEach(function(m) {
      messagesArray.push(m.status === undefined ? m : m.id);
    });
  }
  if (messagesArray.length) {
    // DB Query
    Message.findIn(messagesArray, function (err, result) {
        // Check DB Error
        if (err) {
          // Set Response
          res.error = 407;
          return next(null, res);
        }
        // Set Response
        res.error = false;
        res.data = result;
        return next(null, res);
    });
  }
  else {
    // Set Response
    res.error = false;
    res.data = null;
    return next(null, res);
  }
};

module.exports = function() {
  var express = require('express');
  var app = express();

  // Add
  app.route('/read/:_id/:friendId')
    .get(Auth.isAuthorized, exports.read);

  // List
  app.route('/:_id')
    .get(Auth.isAuthorized, exports.list)
    .post(Auth.isAuthorized, exports.add);

  return app;
}();
