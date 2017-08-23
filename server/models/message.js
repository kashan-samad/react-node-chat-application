var db = require('../config/db');
var db_entity = 'messages';
var mongo = require('mongodb');
var ObjectID = mongo.ObjectID;

exports.all = function(callback) {
  var collection = db.get().collection(db_entity);
  collection.find().toArray(function (err, docs) {
    callback(err, docs);
  });
};

exports.find = function(record, callback) {
  var collection = db.get().collection(db_entity);
  collection.findOne(record, function (err, item) {
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
  collection.findOne({_id: ObjectID(id)}, function (err, item) {
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

exports.delete = function(id, callback) {
  var collection = db.get().collection(db_entity);
  collection.remove({'_id': ObjectID(id)}, function (err, item) {
    callback(err, item);
  });
};
