var db = require('../config/db');
var db_entity = 'users';
var mongo = require('mongodb');
var ObjectID = mongo.ObjectID;

exports.all = function(callback) {
  var collection = db.get().collection(db_entity);
  collection.find({status: 1}, {password: 0, accessToken: 0, status: 0}).toArray(function (err, docs) {
    callback(err, docs);
  });
};

exports.find = function(record, callback) {
  var collection = db.get().collection(db_entity);
  collection.findOne(record, {password: 0, accessToken: 0, status: 0}, function (err, item) {
    callback(err, item);
  });
};

exports.findIn = function(ids, callback) {
  var collection = db.get().collection(db_entity);
  collection.find({_id: {$in: ids }}).toArray(function (err, docs) {
    callback(err, docs);
  });
};

exports.findById = function(id, callback) {
  var collection = db.get().collection(db_entity);
  collection.findOne({_id: ObjectID(id)}, {password: 0, accessToken: 0, status: 0}, function (err, item) {
    callback(err, item);
  });
};

exports.findByUsername = function(username, callback) {
  var collection = db.get().collection(db_entity);
  collection.find({username: username}).toArray(function (err, docs) {
    callback(err, docs);
  });
};

exports.findByLogin = function(username, password, callback) {
  var collection = db.get().collection(db_entity);
  collection.findOne({'username': username, 'password': password}, {_id: 1, name: 1, username: 1, role: 1, accessToken: 1, imageUri: 1, status: 1}, function (err, item) {
    callback(err, item);
  });
};

exports.findByAccessToken = function(accessToken, callback) {
  var collection = db.get().collection(db_entity);
  collection.findOne({'accessToken': accessToken}, function (err, item) {
    callback(err, item);
  });
};

exports.create = function(record, callback) {
  var collection = db.get().collection(db_entity);
  collection.insert(record, function (err, docs) {
    callback(err, docs);
  });
};

exports.update = function(id, record, callback) {
  var collection = db.get().collection(db_entity);
  collection.update({_id: ObjectID(id)}, {$set: record}, function (err, item) {
    callback(err, item);
  });
};

exports.updateAccessToken = function(id, accessToken, callback) {
  var collection = db.get().collection(db_entity);
  collection.update({_id: ObjectID(id)}, {$set: {accessToken: accessToken}}, function (err, item) {
    callback(err, item);
  });
};

exports.delete = function(id, callback) {
  var collection = db.get().collection(db_entity);
  collection.remove({'_id': ObjectID(id)}, function (err, item) {
    callback(err, item);
  });
};
