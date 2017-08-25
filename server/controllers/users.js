var Auth = require('./auth');
var User = require('../models/user');
var crypto = require('crypto');
var faker = require('faker');

exports.add = function(req, res, next) {
  // If Response already set, goto next call
  if (res.error || res.data) {
    return next(null, res);
  }
  // Check Body Params
  var record = req.body;
  if (!record.name || !record.username || !record.password) {
    // Set Response
    res.error = 401;
    return next(null, res);
  }
  record.password = crypto.createHash('sha1').update(record.password).digest('hex');
  // DB Query
  User.find(record, function (err, item) {
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
    record.password = record.password; //create hash
    record.role = 'user';
    record.imageUri = faker.image.image();
    record.accessToken = '';
    record.status = 1;
    // DB Query
    User.create(record, function (err, item) {
      // Check DB Error
      if (err) {
        // Set Response
        res.error = 407;
        return next(null, res);
      }
      // Set Response
      res.error = false;
      res.data = {_id: record._id};
      return next(null, res);
    });
  });
};

exports.login = function(req, res, next) {
  // If Response already set, goto next call
  if (res.error || res.data) {
    return next(null, res);
  }
  var user = res.user;
  if (user) {
      var currentDate = (new Date()).valueOf().toString();
      var randomString = Math.random().toString();
      // Formulate accessToken
      user.accessToken = crypto.createHash('sha1').update(currentDate + randomString).digest('hex');
      //user.accessToken = user.username;
      // DB Query
      User.updateAccessToken(user._id, user.accessToken, function (err, item) {
        // Check DB Error
        if (err) {
          // Set Response
          res.error = 407;
          return next(null, res);
        }
        // Set Response
        res.error = false;
        res.data = user;
        return next(null, res);
      });
  }
  else {
    res.error = 409;
    return next(null, res);
  }
};

exports.logout = function(req, res, next) {
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
  user.accessToken = '';
  // DB Query
  User.updateAccessToken(user._id, user.accessToken, function (err, item) {
    // Check DB Error
    if (err) {
      // Set Response
      res.error = false;
      res.data = user;
      return next(null, res);
    }
    // Set Response
    res.error = false;
    res.data = {_id: ''};
    return next(null, res);
  });
};

exports.detail = function(req, res, next) {
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
  var record = req.params;
  if (!record._id) {
    // Set Response
    res.error = 401;
    return next(null, res);
  }
  // DB Query
  User.findById(record._id, function (err, item) {
    // Check DB Error
    if (err) {
      // Set Response
      res.error = 407;
      return next(null, res);
    }
    if (!item) {
      // Set Response
      res.error = 403;
      return next(null, res);
    }
    // Set Response
    res.error = false;
    res.data = item;
    return next(null, res);
  });
};

exports.update = function(req, res, next) {
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
  if (user._id.toString() !== record._id.toString()) {
    // Set Response
    res.error = 405;
    return next(null, res);
  }
  // Get Body Params
  var record = req.body;
  // DB Query
  User.update(user._id, record, function (err, item) {
    // Check DB Error
    if (err) {
      // Set Response
      res.error = 407;
      return next(null, res);
    }
    User.find(record, function (err, item) {
      // Check DB Error
      if (err) {
        // Set Response
        res.error = 407;
        return next(null, res);
      }
      // Set Response
      res.error = false;
      res.data = item;
      return next(null, res);
    });
  });
};

exports.find = function(req, res, next) {
  // If Response already set, goto next call
  if (res.error || res.data) {
    return next(null, res);
  }
  // Get Body Params
  var record = req.body;
  if (!record.username) {
    res.error = 401;
    return next(null, res);
  }
  // DB Query
  User.findByUsername(record.username, function (err, result) {
    // Check DB Error
    if (err) {
      res.error = 407;
      return next(null, res);
    }
    // Set Response
    res.error = false;
    res.data = result;
    return next(null, res);
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
    result = {count: result.length, results: result};
    res.data = result;
    return next(null, res);
  });
};

module.exports = function() {
  var express = require('express');
  var app = express();

  // Register
  app.route('/register')
    .post(exports.add);

  // Login
  app.route('/login')
    .post(Auth.isAuthenticated, exports.login);

  // Logout
  app.route('/logout')
    .get(Auth.isAuthorized, exports.logout);

  // Detail & Update
  app.route('/:_id')
    .get(Auth.isAuthorized, exports.detail)
    .put(Auth.isAuthorized, exports.update);

  // Find
  app.route('/find')
    .post(Auth.isAuthorized, exports.find);

  // List
  app.route('/')
    .get(Auth.isAuthorized, exports.list);

  return app;
}();
