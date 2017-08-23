var Auth = require('./auth');
var Group = require('../models/group');
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
  var user = res.user;  // Check Body Params
  var record = req.body;
  if (!record.title) {
    // Set Response
    res.error = 401;
    return next(null, res);
  }
  // DB Query
  Group.find(record, function (err, item) {
    // Check DB Error
    if (err) {
      // Set Response
      res.error = 407;
      return next(null, res);
    }
    if (item) {
      // Set Response
      res.error = 410;
      return next(null, res);
    }
    record.createdBy = user._id;
    record.users = [];
    record.users.push (user._id);
    // DB Query
    Group.create(record, function (err, item) {
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
};

exports.join = function(req, res, next) {
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
  // DB Query
  Group.findById(record._id, function (err, group) {
    // Check DB Error
    if (err) {
      // Set Response
      res.error = 407;
      return next(null, res);
    }
    if (!group) {
      // Set Response
      res.error = 403;
      return next(null, res);
    }
    //var index = user.friends.indexOf(friend._id);
    var addUser = true;
    group.users.forEach(function(f) {
      if (f.toString() === user._id.toString()) {
        addUser = false;
      }
    });
    if (addUser) {
      group.users.push(user._id);
    }
    // DB Query
    Group.update(group._id, group, function (err, item) {
      // Check DB Error
      if (err) {
        // Set Response
        res.error = 407;
        return next(null, res);
      }
      if (!user.groups) {
        user.groups = [];
      }
      if (addUser) {
        user.groups.push({id: group._id});
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
  Group.all(function (err, result) {
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

  // Join
  app.route('/join/:_id')
    .get(Auth.isAuthorized, exports.join);

  // List
  app.route('/')
    .get(Auth.isAuthorized, exports.list)
    .post(Auth.isAuthorized, exports.add);

  return app;
}();
