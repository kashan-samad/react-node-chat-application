var User = require('../models/user');
var crypto = require('crypto');

exports.isAuthenticated = function(req, res, next) {
  // If Response already set, goto next call
  if (res.error || res.data) {
    return next(null, res);
  }
  // Get Body Params
  var record = req.body;
  if (!record.username || !record.password) {
    res.error = 401;
    return next(null, res);
  }
  var password = crypto.createHash('sha1').update(record.password).digest('hex');
  // DB Query
  User.findByLogin(record.username, password, function (err, user) {
    // Check DB Error
    if (err) {
      res.error = 407;
      return next(null, res);
    }
    // Check User
    if (!user) {
      res.error = 409;
      return next(null, res);
    }
    // Check User Role
    if (!(user.role === 'user')) {
      res.error = 405;
      return next(null, res);
    }
    // Check User Status
    if (!user.status) {
      res.error = 406;
      return next(null, res);
    }
    // Set Response
    res.error = false;
    res.user = user;
    return next(null, res);
  });
};

exports.isAuthorized = function(req, res, next) {
  // If Response already set, goto next call
  if (res.error || res.data) {
    return next(null, res);
  }
  // Local Variables
  var record = req.headers;
  // Check Auth Header
  if (!record.auth) {
    res.error = 405;
    return next(null, res);
  }
  // DB Query
  User.findByAccessToken(record.auth, function (err, user) {
    // Check DB Error
    if (err) {
      res.error = 407;
      return next(null, res);
    }
    // Check User
    if (!user) {
      res.error = 405;
      return next(null, res);
    }
    // Check User Role
    if (!(user.role === 'user')) {
      res.error = 405;
      return next(null, res);
    }
    // Check User Status
    if (!user.status) {
      res.error = 405;
      return next(null, res);
    }
    // Set Response
    res.error = false;
    res.user = user;
    return next(null, res);
  });
};
