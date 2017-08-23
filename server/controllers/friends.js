var Auth = require('./auth');
var User = require('../models/user');

exports.request = function(req, res, next) {
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
  if (user._id.toString() === record._id.toString()) {
    res.error = 405;
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
      res.error = 403;
      return next(null, res);
    }
    if (!user.friends) {
      user.friends = [];
    }
    var addFriend = true;
    if (user.friends) {
      user.friends.forEach(function(f) {
        if (f.id.toString() === friend._id.toString()) {
          addFriend = false;
        }
      });
    }
    if (addFriend) {
      user.friends.push({id: friend._id, status: 'pending'});
    }
    // DB Query
    User.update(user._id, user, function (err, item) {
      // Check DB Error
      if (err) {
        // Set Response
        res.error = 407;
        return next(null, res);
      }
      if (!friend.friends) {
        friend.friends = [];
      }
      if (addFriend) {
        friend.friends.push({id: user._id, status: 'request'});
      }
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
        res.data = res.user;
        return next(null, res);
      });
    });
  });
};

exports.confirm = function(req, res, next) {
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
  if (user._id.toString() === record._id.toString()) {
    res.error = 405;
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
      res.error = 403;
      return next(null, res);
    }
    if (!user.friends) {
      // Set Response
      res.error = 403;
      return next(null, res);
    }
    var addFriend = false;
    if (user.friends) {
      user.friends.forEach(function(f) {
        if (f.id.toString() === friend._id.toString() && f.status.toString() === 'request') {
          f.status = 'accept';
          addFriend = true;
        }
      });
    }
    // DB Query
    User.update(user._id, user, function (err, item) {
      // Check DB Error
      if (err) {
        // Set Response
        res.error = 407;
        return next(null, res);
      }
      friend.friends.forEach(function(f) {
        if (f.id.toString() === user._id.toString() && f.status.toString() === 'pending') {
          f.status = 'accept';
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
        res.data = res.user;
        return next(null, res);
      });
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
    res.error = 403;
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
      res.error = 403;
      return next(null, res);
    }
    if (!user.friends) {
      // Set Response
      res.error = 403;
      return next(null, res);
    }
    var index = 0;
    user.friends.forEach(function(f) {
      if (f.id.toString() === friend._id.toString()) {
        user.friends.splice(index, 1);
      }
      index++;
    });
    // DB Query
    User.update(user._id, user, function (err, item) {
      // Check DB Error
      if (err) {
        // Set Response
        res.error = 407;
        return next(null, res);
      }
      var index = 0;
      friend.friends.forEach(function(f) {
        if (f.id.toString() === user._id.toString()) {
          friend.friends.splice(index, 1);
        }
        index++;
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
  var user = res.user;
  friendFound = false;
  friends = '';
  friendsArray = [];
  if (user.friends) {
    user.friends.forEach(function(f) {
      friendsArray.push(f.status === undefined ? f : f.id);
    });
  }
  if (friendsArray.length) {
    // DB Query
    User.findIn(friendsArray, function (err, result) {
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

  // Request
  app.route('/request/:_id')
    .get(Auth.isAuthorized, exports.request);

  // Delete
  app.route('/confirm/:_id')
    .get(Auth.isAuthorized, exports.confirm);

  // Delete
  app.route('/delete/:_id')
    .get(Auth.isAuthorized, exports.delete);

  // List
  app.route('/')
    .get(Auth.isAuthorized, exports.list);

  return app;
}();
