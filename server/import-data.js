var User = require('./models/user');
var faker = require('faker');
var crypto = require('crypto');

exports.update = function(req, res, next) {
  // DB Query
  User.all(function (err, result) {
    // Check DB Error
    if (err) {
      // Set Response
      res.error = 407;
      return next(null, res);
    }
    var count = 0;
    result.forEach(function(u) {
      u.imageUri = faker.image.image();
      // DB Query
      User.update(u._id, u, function (err, item) {
        // Check DB Error
        if (err) {
          // Set Response
          res.error = 407;
          return next(null, res);
        }
        count++;
        if (result.length === count) {
          // Set Response
          res.error = false;
          res.data = result;
          return next(null, res);
        }
      });
    });
  });
};

exports.import = function(req, res, next) {
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
    if (result.length < 200) {
      var results = [];
      var userCount = 10;
      var count = 0;
      for (var i=0; i<userCount; i++) {
        password = faker.internet.password();
        record = {'name': faker.name.findName(),
          'username': faker.internet.userName(),
          'password': crypto.createHash('sha1').update(password).digest('hex'),
          'accessToken': '',
          'role': 'user',
          'status': 1
        };
        results.push(record);
        console.log ('record: ' + results[count].name);
        // DB Query
        User.create(record, function (err, item) {
          // Check DB Error
          if (err) {
            // Set Response
            res.error = 407;
            return next(null, res);
          }
          count++;
          //console.log ('success - ' + record._id);
          //console.log ('adding: ' + record.name);
          //console.log ('count - ' + count);
          //console.log ('userCount - ' + userCount);
          if (count === userCount) {
            res.data = results;
            return next(null, res);
          }
          // Set Response
          //res.error = false;
          //res.data = {_id: record._id};
          //return next(null, res);
        });
      }
    }
    else {
      return next(null, res);
    }
  });
};

module.exports = function() {
  var express = require('express');
  var app = express();

  // Update
  app.route('/update')
    .get(exports.update);

  // New
  app.route('/new')
    .get(exports.import);

  return app;
}();
