var Auth = require('./auth');
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
  // Get Body Params
  var record = req.body;
  if (!record.id) {
	// Set Response
	res.error = 401;
	return next(null, res);
  }
  if (res.user._id.toString() === record.id.toString()) {
    res.error = 405;
    return next(null, res);
  }
  // DB Query
  User.findById(record.id, function (err, friend) {
    // Check DB Error
    if (err) {
      // Set Response
      res.error = 407;
      return next(null, res);
    }
    if (!friend) {
      // Set Response
      res.error = 432;
      return next(null, res);
    }
    if (!user.friends) {
      user.friends = [];
    }
    var index = user.friends.indexOf(friend._id);
    var addFriend = true;
    user.friends.forEach(function(f) {
      if (f.toString() === friend._id.toString()) {
        addFriend = false;
      }
    });
    if (addFriend) {
      user.friends.push(friend._id);
    }
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
  });
};

exports.delete = function(req, res, next) {
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
  if (res.user._id.toString() === record._id.toString()) {
    res.error = 415;
    return next(null, res);
  }
  // DB Query
  User.findById(record._id, function (err, friend) {
    // Check DB Error
    if (err) {
      // Set Response
      res.error = 407;
      return next(null, res);
    }
    if (!friend) {
      // Set Response
      res.error = 432;
      return next(null, res);
    }
    if (!user.friends) {
      // Set Response
      res.error = 432;
      return next(null, res);
    }
    var index = 0;
    user.friends.forEach(function(f) {
      if (f.toString() === friend._id.toString()) {
        user.friends.splice(index, 1);
      }
      index++;
    });
    // DB Query
    User.update(user._id, user, function (err, user) {
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
  // DB Query
  User.all(function (err, result) {
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
};

module.exports = function() {
  var express = require('express');
  var app = express();

  // Add
  app.route('/add')
    .post(Auth.isAuthorized, exports.add);

  // Delete
  app.route('/delete/:_id')
    .get(Auth.isAuthorized, exports.delete);

  // List
  app.route('/')
    .get(Auth.isAuthorized, exports.list);

  return app;
}();
